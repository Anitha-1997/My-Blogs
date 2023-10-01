import { verifyPassword } from "@/lib/auth";
import connectToDatabase, { userExists } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions = {
  // object used to configure NextAuth's behaviour
  session: {
    strategy: "jwt",
  },
  secret: process.env.SESSION_SECRET,
  providers: [
    CredentialProvider({
      name: "credentials",
      authorize: async (credentials) => {
        console.log("credentials= ", credentials);

        const client = await connectToDatabase();
        const db = client.db();
        const user = await userExists(db, "users", {
          email: credentials.email,
        });

        if (!user) {
          // no user with the entered email
          client.close();
          throw new Error("No user found!");
        }
        console.log("user= ", user);

        // found a user with that email address, check for password
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid password! Try again!");
        }

        client.close();

        // authorization succeeded

        // return object that is encoded for JWT token
        return { email: user.email };
      },
    }),
  ],
};

export default NextAuth(authOptions);
