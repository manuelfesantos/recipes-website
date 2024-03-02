import Head from "next/head";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { UserDTO } from "@/types/user";
import { GetServerSideProps } from "next";
import { deleteCookie } from "cookies-next";
import { getCollection } from "@/utils/mongo-db/db-client";
import { ObjectId } from "mongodb";
import { buildUserDTOFromDocument } from "@/utils/transformer/documentToDTO";
import Link from "next/link";
import styles from "@/styles/ProfilePage.module.css";
import { useState } from "react";
import Background from "@/components/Background";
import process from "process";

export default function ProfilePage({ user }: { user: UserDTO }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(user.imageUrl ?? "");

  const changeProfilePic = async (files: FileList | null) => {
    if (!files || !files.length) {
      console.log("No files were loaded");
      return;
    }
    setImageUrl("/Rolling-1s-460px.gif");
    const file = files[0];
    const fileName =
      `${user.username}/profile.${file.name.split(".").pop()}`.replace(
        " ",
        "_",
      );
    const formData = new FormData();
    formData.append("picture", file);

    const response = await fetch(`/api/pictures?name=${fileName}`, {
      method: "PUT",
      body: formData,
    });

    const newImageUrl = `https://floral-hill-5d85.manuelfesantos.workers.dev/${fileName}`;

    if (response.status === 200) {
      const userDTO: UserDTO = {
        ...user,
        imageUrl: newImageUrl,
      };

      const headers = new Headers();
      headers.append("property", "imageUrl");

      await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(userDTO),
      });

      router.reload();
    }
  };

  const handleLogout = async () => {
    deleteCookie("user");
    await router.push("/");
  };

  return (
    <>
      <Head>
        <title>Profile Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.profileDiv}>
        <h1 className={styles.title}>
          {user.firstName} {user.lastName}
        </h1>
        <div className={styles.userDetails}>
          <div
            className={styles.profilePic}
            style={{
              backgroundImage: `url(${imageUrl || "/default-profile-pic.jpeg"})`,
            }}
          ></div>
          <h2>({user.username})</h2>
          <label className={styles.btn} htmlFor={"picture"}>
            Change Profile Picture
          </label>
          <input
            placeholder={"change profile picture"}
            id={"picture"}
            type={"file"}
            onChange={(event) => changeProfilePic(event.target.files)}
            style={{ visibility: "hidden", position: "absolute" }}
            accept={"image/jpeg"}
          />
          <Link
            className={`${styles.favoritesLink} ${styles.btn}`}
            onClick={() => sessionStorage.removeItem("currentRecipe")}
            href={"/profile/favorites"}
          >
            Favorite Recipes
          </Link>
          <button className={styles.btn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <Background />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user: userId } = req.cookies;
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const collection = await getCollection(
    String(process.env.USERS_COLLECTION_NAME),
  );
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { user: buildUserDTOFromDocument(user) } };
};
