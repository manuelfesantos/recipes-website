import RecipeItem from "@/components/RecipeItem";
import { Recipe } from "@/types/recipes";
import styles from "@/styles/RecipeList.module.css";
import { UserDTO } from "@/types/user";
import { useEffect } from "react";

interface Props {
  recipes: Recipe[];
  user: UserDTO | null;
  handleAddFavorite: (recipe: Recipe) => Promise<void>;
  handleRemoveFavorite: (recipe: Recipe) => Promise<void>;
}

export default function RecipeList({
  recipes,
  user,
  handleRemoveFavorite,
  handleAddFavorite,
}: Props) {
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div className={styles.recipeList}>
      {recipes.map((recipe) => (
        <RecipeItem
          recipe={{
            calories: recipe.calories,
            image: recipe.image,
            ingredientLines: recipe.ingredientLines,
            label: recipe.label,
            source: recipe.source,
            uri: recipe.uri,
            yield: recipe.yield,
          }}
          key={recipe.uri.slice(51)}
          user={user}
          addToFavorites={(recipe) => handleAddFavorite(recipe)}
          removeFromFavorites={(recipe) => handleRemoveFavorite(recipe)}
        />
      ))}
    </div>
  );
}
