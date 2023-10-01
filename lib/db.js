import { MongoClient } from "mongodb";

export default async function connectToDatabase() {
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.5b0qadb.mongodb.net/${process.env.mongodb_database_auth}?retryWrites=true&w=majority&appName=AtlasApp`;
  const client = await MongoClient.connect(connectionString);

  return client;
}

export async function userExists(db, collection, filter) {
  const existingUser = await db.collection(collection).findOne(filter);

  return existingUser;
}
