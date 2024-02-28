import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { User, UserDTO } from "@/types/user";
import process from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!["GET", "POST"].includes(`${req.method}`)) {
    res.json({ status: 405 });
    return;
  }

  const collection = await getCollection();

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
            const userToSave: User = {
              username: parsedBody.username,
              password: parsedBody.password,
              recipes: parsedBody.recipes,
            };
            bcrypt
              .hash(parsedBody.password, Number(process.env.SALT_ROUNDS))
              .then(async (hash: any) => {
                console.log(hash);
                const response = await collection.insertOne({
                  ...parsedBody,
                  password: hash,
                });
                const user = await collection.findOne({
                  username: parsedBody.username,
                });
                if (!user) {
                  res.json({ status: 500 });
                  return;
                }
                const userDTO: UserDTO = {
                  username: user.username,
                  recipes: user.recipes,
                  _id: `${user._id}`,
                };
                res.json({ status: 201, user: userDTO });
              });
          }
          break;
        case "login":
          if (!userToValidate) {
            res.json({ status: 404 });
            return;
          }

          bcrypt.compare(
            parsedBody.password,
            userToValidate.password,
            (err: any, result: boolean) => {
              if (!result) {
                res.json({ status: 403 });
                return;
              }
              const userDTO: UserDTO = {
                username: userToValidate.username,
                recipes: userToValidate.recipes,
                _id: `${userToValidate._id}`,
              };
              res.json({ status: 200, user: userDTO });
            },
          );
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
