import { NextApiRequest, NextApiResponse } from "next";
import { resend } from "@/utils/resend/resend";
import { getCollection } from "@/utils/mongo-db/db-client";
import process from "process";
import { ObjectId } from "mongodb";
import { sendMail } from "@/utils/sendgrid/sendgrid";

const validateBody = (username: string, email: string) => {
  const usernameIsAlphaNumeric = /^[A-Za-z0-9]*$/.test(username);
  if (!usernameIsAlphaNumeric) {
    return { message: "Please provide a valid username", status: 400 };
  }
  const emailIsEmailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!emailIsEmailPattern) {
    return { message: "Please provide a valid email", status: 400 };
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
    date: Date.now(),
    token: token,
    userId: id,
  });
  return insertResult.acknowledged;
};

const createAndSendEmail = async (
  username: string,
  token: string,
  userId: ObjectId,
  email: string,
) => {
  const text = `Hi ${username}!  You can change your password following this link: ${process.env.WEBSITE_URL}/profile/reset-password/${token}/${userId}`;
  const subject = "Reset Password";

  return await sendMail(text, email, subject);
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.json({
      message: `Unable to process ${req.method} request. Please use POST`,
      status: 405,
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
      res.json({ message: "Username and email don't match", status: 404 });
      return;
    }

    const token = generateToken(username, email);

    const tokenCreated = await saveTokenAndId(token, userId);

    if (!tokenCreated) {
      res.json({
        message: "There was an error generating your token... please try again",
        status: 500,
      });
    }

    const [response] = await createAndSendEmail(username, token, userId, email);

    console.log("Email status code: ", response.statusCode);

    if (response.statusCode !== 202) {
      res.json({
        message: "There was an error sending your email... please try again",
        status: 500,
      });

      return;
    }

    res.json({
      message:
        "Email sent successfully! Please wait up to 5 minutes to receive it in your inbox",
      status: response.statusCode,
    });
  } catch (error) {
    res.json({
      message:
        "There was a problem while processing your request. Please try again",
      status: 500,
    });
  }
}
