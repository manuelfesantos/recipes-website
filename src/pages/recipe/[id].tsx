import { getSingleRecipe } from "@/util/api-client";
import { RecipeDetails } from "@/types/recipes";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { encode } from "querystring";
import Link from "next/link";
import IngredientList from "@/components/IngredientList";
import styles from "@/styles/RecipePage.module.css";
import RecipeProfile from "@/components/RecipeProfile";

export default function RecipePage(recipe: RecipeDetails) {
  return (
    <div className={styles.recipeDiv}>
      <RecipeProfile title={recipe.label} image={recipe.image} />
      <IngredientList ingredients={recipe.ingredients} />
      <div className={styles.links}>
        <Link className={styles.link} href={".."}>
          Back to Recipes
        </Link>
        <Link className={styles.link} href={recipe.url} target="_blank">
          Check the preparation steps in {recipe.source}
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const params = encode(context.query);
  const wrappedRecipe = getSingleRecipe(params.slice(3));
  const recipe = (await wrappedRecipe).recipe as RecipeDetails;
  return {
    props: recipe,
  };
};
