import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const session = await getServerSession(req, res, authOptions);
    console.log(session);
    if (!session) {
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }
    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (
      !oldPassword ||
      !newPassword ||
      oldPassword.trim() === "" ||
      newPassword.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid inputs" });
      return;
    }
    const client = await connectToDatabase();
    const userCollection = await client.db().collection("users");
    const user = await userCollection.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      client.close();
      return;
    }

    const currentPassword = user.password;
    const isValid = await verifyPassword(oldPassword, currentPassword);
    if (!isValid) {
      res.status(422).json({ message: "Invalid password" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    const result = await userCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );

    client.close();
    res.status(200).json({ message: "Password updated" });
  }
  return;
}
