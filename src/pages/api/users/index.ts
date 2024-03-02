import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { UserDTO } from "@/types/user";
import process from "process";
import { buildUserDTOFromDocument } from "@/utils/transformer/documentToDTO";
import { comparePasswords, encryptPassword } from "@/utils/bcrypt/bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!["GET", "POST"].includes(`${req.method}`)) {
    res.json({ status: 405 });
    return;
  }

  const collection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );

  switch (req.method) {
    case "POST":
      const bcrypt = require("bcrypt");

      const action = `${req.headers.action}`;

      const parsedBody = JSON.parse(req.body ?? "");

      const userToValidate = await collection.findOne({
        username: parsedBody.username,
      });

      switch (action) {
        case "signup":
          const alreadyExists = Boolean(userToValidate);
          if (alreadyExists) {
            res.json({ status: 400 });
          } else {
            const encryptedPassword = encryptPassword(parsedBody.password);
            if (!encryptedPassword) {
              res.json({
                status: 500,
                message: "There was a problem encrypting the password",
              });
              return;
            }

            await collection.insertOne({
              ...parsedBody,
              password: encryptedPassword,
            });
            const user = await collection.findOne({
              username: parsedBody.username,
            });
            if (!user) {
              res.json({ status: 500 });
              return;
            }
            const userDTO: UserDTO = buildUserDTOFromDocument(user);
            res.json({ status: 201, user: userDTO });
          }
          break;
        case "login":
          if (!userToValidate) {
            res.json({ status: 404 });
            return;
          }

          const passwordsMatch = comparePasswords(
            parsedBody.password,
            userToValidate.password,
          );
          if (!passwordsMatch) {
            res.json({ status: 403 });
            return;
          }
          const userDTO: UserDTO = buildUserDTOFromDocument(userToValidate);
          res.json({ status: 200, user: userDTO });
          break;
      }
      break;

    case "GET":
      const allUsers = await collection.find().toArray();
      const userDTOs = allUsers.map((user) => ({
        username: user.username,
        recipes: user.recipes,
      }));
      res.json(
        allUsers
          ? { status: 200, users: userDTOs }
          : { status: 404, users: [] },
      );
      break;
  }
}
