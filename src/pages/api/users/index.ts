import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const collection = await getCollection();

  switch (req.method) {
    case "POST":
      const parsedBody = JSON.parse(req.body ?? "");
      const alreadyExists = Boolean(
        await collection.findOne({ username: parsedBody.username }),
      );
      if (alreadyExists) {
        res.status(400);
      } else {
        const response = await collection.insertOne(parsedBody);
        res.status(201);
      }
      break;
    case "GET":
      const allUsers = await collection.find().toArray();
      res.json(
        allUsers
          ? { status: 200, users: allUsers }
          : { status: 400, users: [] },
      );
      break;
  }
}
