import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { UserDTO } from "@/types/user";
import process from "process";
import { buildUserDTOFromDocument } from "@/utils/transformer/document-to-dto";
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
      console.log("POST request to users endpoint");
      const action = `${req.headers.action}`;

      const parsedBody = JSON.parse(req.body ?? "");

      const userToValidate = await collection.findOne({
        username: parsedBody.username,
      });

      switch (action) {
        case "signup":
          console.log("Signup selected");
          const alreadyExists = Boolean(userToValidate);
          if (alreadyExists) {
            res.json({ status: 400 });
          } else {
            console.log("Encrypting password...");
            const encryptedPassword = encryptPassword(parsedBody.password);
            if (!encryptedPassword) {
              res.json({
                message: "There was a problem encrypting the password",
                status: 500,
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
          console.log("Login selected");
          if (!userToValidate) {
            res.json({ status: 404 });
            return;
          }

          console.log("Checking if passwords match...");

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
      console.log("Getting all users...");
      const allUsers = await collection.find().toArray();
      const userDTOs = allUsers.map((user) => ({
        recipes: user.recipes,
        username: user.username,
      }));
      res.json(
        allUsers
          ? { status: 200, users: userDTOs }
          : { status: 404, users: [] },
      );
      break;
  }
}
