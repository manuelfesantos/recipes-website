import { getSingleRecipeById } from "@/utils/api-client";
import { RecipeDetails } from "@/types/recipes";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { encode } from "querystring";
import Link from "next/link";
import IngredientList from "@/components/IngredientList";
import styles from "@/styles/RecipePage.module.css";
import RecipeProfile from "@/components/RecipeProfile";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RecipePage(recipe: RecipeDetails) {
  const images = recipe.images;

  const image = images.LARGE?.url ?? recipe.image;
  const imageLoader = () => image;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{recipe.label} Recipe</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.recipeDiv}>
        <RecipeProfile title={recipe.label} image={recipe.image} />
        <div className={styles.recipeData}>
          <Image
            className={styles.img}
            loader={imageLoader}
            placeholder={"blur"}
            width={300}
            height={300}
            blurDataURL={"/Rolling-1s-460px.gif"}
            alt={recipe.label}
            src={image}
          />
          <IngredientList ingredients={recipe.ingredients} />
        </div>
        <div className={styles.links}>
          <Link
            className={styles.link}
            href={"https://www.justtherecipe.com/?url=" + recipe.url}
            target="_blank"
          >
            Get Preparation Steps
          </Link>
          <Link
            className={styles.link}
            href={`/#${router.query.id}`}
            scroll={true}
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const params = encode(context.query);
  const wrappedRecipe = getSingleRecipeById(params.slice(3));
  const recipe = (await wrappedRecipe).recipe as RecipeDetails;
  return {
    props: recipe,
  };
};
