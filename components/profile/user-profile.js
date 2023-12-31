import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  // if (status !== "loading" && !session) {
  //   router.push("/auth");
  //   return null;
  // }

  // if (status === "loading")
  //   return <p className={classes.profile}>Loading...</p>;
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
