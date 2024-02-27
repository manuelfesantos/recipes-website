import RecipeMain from "@/components/RecipeMain";
import { GetServerSideProps } from "next";
import { User } from "@/types/user";

export default function HomePage({ user }: { user: User | null }) {
  return <RecipeMain user={user} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const userCookie = req.cookies.user;
  if (userCookie) {
    const user = JSON.parse(userCookie);
    return {
      props: {
        user,
      },
    };
  } else {
    return {
      props: {
        user: null,
      },
    };
  }
};
