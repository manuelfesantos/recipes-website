import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { ObjectId } from "mongodb";
import { UserDTO } from "@/types/user";
import { buildUserDTOFromDocument } from "@/utils/transformer/documentToDTO";
import process from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!["PUT", "GET", "DELETE"].includes(`${req.method}`)) {
    res.json({ status: 405 });
    return;
  }
  const id = req.query.id as string;
  const collection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );
  switch (req.method) {
    case "DELETE":
      const deleteResult = await collection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json({ status: deleteResult.acknowledged ? 202 : 404 });
      break;
    case "GET":
      const getResult = await collection.findOne({ _id: new ObjectId(id) });

      if (!getResult) {
        res.json({ status: 404 });
        return;
      }
      const getUserDTO: UserDTO = buildUserDTOFromDocument(getResult);
      res.json({ status: 200, user: JSON.stringify(getUserDTO) });

      break;
    case "PUT":
      const putParsedBody: UserDTO = JSON.parse(req.body ?? "");

      const updateQuery: any = {};

      switch (req.headers.property) {
        case "recipes":
          updateQuery.recipes = putParsedBody.recipes;
          break;
        case "imageUrl":
          updateQuery.imageUrl = putParsedBody.imageUrl;
          break;
      }

      const putResult = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updateQuery,
        },
      );
      if (!putResult.matchedCount) {
        res.json({ status: 404, user: {} });
        return;
      }

      const putUser = await collection.findOne({ _id: new ObjectId(id) });

      if (!putUser) {
        res.json({ status: 500 });
        return;
      }

      const putUserDTO: UserDTO = buildUserDTOFromDocument(putUser);

      res.json({
        status: 202,
        user: putUserDTO,
      });
      break;
  }
}
