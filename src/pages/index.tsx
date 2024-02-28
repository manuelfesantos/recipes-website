import RecipeMain from "@/components/RecipeMain";
import { GetServerSideProps } from "next";
import { UserDTO } from "@/types/user";
import { getCollection } from "@/utils/mongo-db/db-client";
import { ObjectId } from "mongodb";
import { buildUserDTOFromDocument } from "@/utils/transformer/documentToDTO";
import Head from "next/head";
import Header from "@/components/Header";
import styles from "@/styles/HomePage.module.css";

export default function HomePage({ user }: { user: UserDTO | null }) {
  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <RecipeMain user={user} />
      <div className={styles.background}></div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user: userId } = req.cookies;
  if (!userId) {
    return {
      props: {
        user: null,
      },
    };
  }

  const collection = await getCollection();
  const user = await collection.findOne({ _id: new ObjectId(userId) });
  return {
    props: {
      user: buildUserDTOFromDocument(user),
    },
  };
};
