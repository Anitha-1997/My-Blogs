import { hashPassword } from "@/lib/auth";
import connectToDatabase, { userExists } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid inputs" });
      return;
    }
    const client = await connectToDatabase();
    const db = client.db();
    const existingUser = await userExists(db, "users", { email: email });
    if (existingUser) {
      res.status(422).json({ message: "User exists already!" });
      client.close();
      return;
    }
    const hashedPassword = await hashPassword(password);
    const result = await db
      .collection("users")
      .insertOne({ email: email, password: hashedPassword });
    res.status(201).json({ message: "Created user!" });
    client.close();
  }
}
