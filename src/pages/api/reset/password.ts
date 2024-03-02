import { NextApiRequest, NextApiResponse } from "next";
import { resend } from "@/utils/resend/resend";
import { getCollection } from "@/utils/mongo-db/db-client";
import process from "process";
import { ObjectId } from "mongodb";

const validateBody = (username: string, email: string) => {
  const usernameIsAlphaNumeric = /^[A-Za-z0-9]*$/.test(username);
  if (!usernameIsAlphaNumeric) {
    return { status: 400, message: "Please provide a valid username" };
  }
  const emailIsEmailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!emailIsEmailPattern) {
    return { status: 400, message: "Please provide a valid email" };
  }

  return null;
};

const validateUser = async (username: string, email: string) => {
  const collection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );
  const user = await collection.findOne({ username });
  if (!user) return null;
  if (user.email !== email) return null;
  return user._id;
};

const generateToken = (username: string, email: string) => {
  const bcrypt = require("bcrypt");
  const token = bcrypt.hashSync(
    `${username}${email}${Date.now()}`,
    Number(process.env.SALT_ROUNDS),
  );
  return String(token).replaceAll("/", "_");
};

const saveTokenAndId = async (token: any, id: ObjectId) => {
  const collection = await getCollection(
    String(process.env.TOKENS_COLLECTION_NAME),
  );
  const insertResult = await collection.insertOne({
    token: token,
    userId: id,
    date: Date.now(),
  });
  return insertResult.acknowledged;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.json({
      status: 405,
      message: `Unable to process ${req.method} request. Please use POST`,
    });
    return;
  }
  try {
    const parsedBody = JSON.parse(req.body ?? "");
    const { username, email } = parsedBody;

    const invalidCredentialsError = validateBody(username, email);
    if (invalidCredentialsError) {
      res.json(invalidCredentialsError);
      return;
    }

    const userId = await validateUser(username, email);
    if (!userId) {
      res.json({ status: 404, message: "Username and email don't match" });
      return;
    }

    const token = generateToken(username, email);

    const tokenCreated = await saveTokenAndId(token, userId);

    if (!tokenCreated) {
      res.json({
        status: 500,
        message: "There was an error generating your token... please try again",
      });
    }

    const response = await resend.emails.send({
      from: "Manuel <recipes@resend.dev>",
      text: `Hi ${username}!  You can change your password following this link: http://localhost:3000/profile/reset-password/${token}/${userId}`,
      subject: "Password Reset",
      to: email,
    });
    if (response.error) {
      console.log(response.error);
      res.json({
        status: 500,
        message: "there was a problem sending your email... please try again",
      });
    } else {
      console.log(response.data);
      res.json({ status: 200 });
    }
  } catch (error) {
    res.json({
      status: 500,
      message:
        "There was a problem while processing your request. Please try again",
    });
  }
}
