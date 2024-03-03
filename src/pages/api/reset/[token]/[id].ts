import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import process from "process";
import { ObjectId } from "mongodb";
import { encryptPassword } from "@/utils/bcrypt/bcrypt";
import { minutesPassed } from "@/utils/time/time";

const validateToken = async (token: string, id: string) => {
  console.log("validating Token...");
  const tokensCollection = await getCollection(
    String(process.env.TOKENS_COLLECTION_NAME),
  );
  const authToken = await tokensCollection.findOne({
    token: token,
    userId: new ObjectId(id),
  });

  console.log(authToken);

  if (!authToken) {
    return {
      message: "Token not authorized or not valid",
    };
  }

  if (minutesPassed(authToken.date) > 10) {
    await tokensCollection.deleteOne({ token: token });
    return {
      message: "Token no longer valid! Please generate a new one.",
    };
  }
  await tokensCollection.deleteMany({ userId: new ObjectId(id) });

  return null;
};

const validateBody = (
  req: NextApiRequest,
  res: NextApiResponse,
): string | null => {
  console.log("Validating body...");
  const parsedBody = JSON.parse(req.body ?? "");

  if (!("password" in parsedBody) || !("verifyPassword" in parsedBody)) {
    res.json({
      message: "Please provide both password and verifyPassword fields",
      status: 400,
    });
    return null;
  }
  const { password, verifyPassword } = parsedBody;

  if (password !== verifyPassword) {
    res.json({ message: "Passwords do not match", status: 400 });
    return null;
  }

  return password;
};

const getUser = async (id: string) => {
  console.log("Getting user from database...");
  const usersCollection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );
  return await usersCollection.findOne({ _id: new ObjectId(id) });
};

const changePassword = async (id: string, password: string) => {
  console.log("Changing password...");
  const usersCollection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );

  const encryptedPassword = encryptPassword(password);
  const putResult = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { password: encryptedPassword },
    },
  );
  return putResult.acknowledged;
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
    const { token, id } = req.query;
    if (!token || !id) {
      res.json({ status: 400 });
      return;
    }

    const password = validateBody(req, res);
    if (!password) return;

    const user = await getUser(String(id));

    if (!user) {
      res.json({ message: "Please provide a valid id", status: 400 });
      return;
    }

    const tokenError = await validateToken(String(token), String(id));

    if (tokenError) {
      res.json({ message: tokenError.message, status: 400 });
      return;
    }

    const passwordChanged = await changePassword(String(id), password);

    if (passwordChanged) {
      res.json({
        message:
          "Password changed successfully. Please login again to access your account.",
        status: 202,
      });
    }
  } catch (error: any) {
    res.json({ message: error.message, status: 500 });
  }
}
