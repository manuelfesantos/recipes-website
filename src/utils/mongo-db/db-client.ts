import * as process from "process";
import { Collection, MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@recipescluster.vafilbz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const getCollection = async (
  collectionName: string,
): Promise<Collection> => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  return db.collection(collectionName);
};
