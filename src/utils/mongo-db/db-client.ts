import * as process from "process";
import { Collection, MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(String(process.env.DB_URI), {
  serverApi: {
    deprecationErrors: true,
    strict: true,
    version: ServerApiVersion.v1,
  },
});
export const getCollection = async (
  collectionName: string,
): Promise<Collection> => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  return db.collection(collectionName);
};
