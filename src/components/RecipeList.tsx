import RecipeItem from "@/components/RecipeItem";
import { Recipe } from "@/types/recipes";
import styles from "@/styles/RecipeList.module.css";

interface Props {
  recipes: Recipe[];
  loadMoreRecipes: () => void;
  hasNextRecipes: boolean;
}

export default function RecipeList({
  recipes,
  loadMoreRecipes,
  hasNextRecipes,
}: Props) {
  return (
    <>
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <RecipeItem
            calories={recipe.calories}
            image={recipe.image}
            ingredientLines={recipe.ingredientLines}
            label={recipe.label}
            source={recipe.source}
            uri={recipe.uri}
            yield={recipe.yield}
            key={recipe.uri.slice(51)}
          />
        ))}
      </div>
      {recipes.length > 0 && hasNextRecipes && (
        <button className={styles.btn} onClick={() => loadMoreRecipes()}>
          Load More...
        </button>
      )}
    </>
  );
}
