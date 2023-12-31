import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid inputs" });
      return;
    }

    const newMessage = { name, email, message };
    let client;
    const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.5b0qadb.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=AtlasApp`;
    try {
      client = await MongoClient.connect(connectionString);
    } catch (error) {
      res.status(500).json({ message: "Could not connect to database" });
      return;
    }
    const db = client.db(process.env.mongodb_database);
    try {
      const result = await db.collection("messages").insertOne(newMessage);
      newMessage._id = result.insertedId;
    } catch (error) {
      res.status(500).json({ message: "Storing message failed!" });
      client.close();
      return;
    }
    client.close();
    res
      .status(201)
      .json({ message: "Successfully stored message!", message: newMessage });
  }
}
