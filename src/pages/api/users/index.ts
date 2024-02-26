import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";

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
            const response = await collection.insertOne(parsedBody);
            const user = await collection.findOne({
              username: parsedBody.username,
            });
            res.json({ status: 201, user: user });
          }
          break;
        case "login":
          if (!userToValidate) {
            res.json({ status: 404 });
            return;
          }
          if (parsedBody.password !== userToValidate.password) {
            res.json({ status: 403 });
            return;
          }
          res.json({ status: 200, user: userToValidate });
          break;
      }
      break;

    case "GET":
      const allUsers = await collection.find().toArray();
      res.json(
        allUsers
          ? { status: 200, users: allUsers }
          : { status: 404, users: [] },
      );
      break;
  }
}
