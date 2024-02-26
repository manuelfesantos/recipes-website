import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { ObjectId } from "mongodb";
import { User } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!["PUT", "GET", "DELETE"].includes(`${req.method}`)) {
    res.json({ status: 405 });
    return;
  }
  const id = req.query.id as string;
  const collection = await getCollection();
  switch (req.method) {
    case "DELETE":
      const deleteResult = await collection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json({ status: deleteResult.acknowledged ? 202 : 404 });
      break;
    case "GET":
      const getResult = await collection.findOne({ _id: new ObjectId(id) });
      getResult
        ? res.json({ status: 200, user: JSON.stringify(getResult) })
        : res.json({ status: 404 });
      break;
    case "PUT":
      const putParsedBody: User = JSON.parse(req.body ?? "");
      const putResult = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            username: putParsedBody.username,
            password: putParsedBody.password,
          },
        },
      );
      putResult.matchedCount
        ? res.json({
            status: 202,
            user: await collection.findOne({ _id: new ObjectId(id) }),
          })
        : res.json({ status: 404, user: {} });
      break;
  }
}
