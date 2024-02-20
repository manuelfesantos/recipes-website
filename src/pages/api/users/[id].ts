import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { ObjectId } from "mongodb";
import { User } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id as string;
  const collection = await getCollection();
  switch (req.method) {
    case "DELETE":
      const deleteResult = await collection.deleteOne({
        _id: new ObjectId(id),
      });
      res.status(deleteResult.acknowledged ? 202 : 404);
      break;
    case "GET":
      const getResult = await collection.findOne({ _id: new ObjectId(id) });
      getResult
        ? res.json({ status: 200, user: JSON.stringify(getResult) })
        : res.json({ status: 404, user: {} });
      break;
    case "PUT":
      const parsedBody: User = JSON.parse(req.body ?? "");
      const putResult = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            username: parsedBody.username,
            password: parsedBody.password,
          },
        },
      );
      putResult.matchedCount
        ? res.json({
            status: 202,
            user: await collection.findOne({ _id: new ObjectId(id) }),
          })
        : res.json({ status: 404, user: {} });
  }
}
