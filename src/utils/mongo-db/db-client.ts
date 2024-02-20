import * as process from "process";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@recipescluster.vafilbz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("users");
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    console.log(
      `Pinged your deployment. You successfully connected to ${db.databaseName}!`,
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
