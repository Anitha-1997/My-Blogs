import UserProfile from "../components/profile/user-profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default ProfilePage;
