import RecipeList from "@/components/RecipeList";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipes";
import { UserDTO } from "@/types/user";
import styles from "@/styles/FavoriteMain.module.css";
import { useRouter } from "next/router";

interface Props {
  user: UserDTO;
}
export default function FavoriteMain({ user }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(user.recipes);
  const router = useRouter();

  const handleAddToFavorites = async (recipe: Recipe) => {
    console.log("adding recipe");
    const userToSave: UserDTO = {
      ...user,
      recipes: [...user.recipes, recipe],
    };
    await updateUser(userToSave);
  };

  const handleRemoveFromFavorites = async (recipe: Recipe) => {
    console.log("removing recipe");
    const userToSave: UserDTO = {
      ...user,
      recipes: recipes.filter((userRecipe) => userRecipe.uri !== recipe.uri),
    };
    await updateUser(userToSave);
  };

  const updateUser = async (userToSave: UserDTO) => {
    setRecipes(userToSave.recipes);
    const headers = new Headers();
    headers.append("property", "recipes");
    const responsePromise = await fetch(`/api/users/${userToSave._id}`, {
      method: "PUT",
      body: JSON.stringify(userToSave),
      headers: headers,
    });

    const response = await responsePromise.json();
    if (response.status === 202) {
      console.log("updating recipes");
      setRecipes(response.user.recipes);
    }
  };

  useEffect(() => {
    const currentRecipe = sessionStorage.getItem("currentRecipe");
    if (currentRecipe) {
      const target = document.getElementById(currentRecipe);
      if (target) {
        target.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  }, []);

  return (
    <>
      <div className={styles.favoriteMain}>
        <div className={styles.favoriteDiv}>
          {recipes.length ? (
            <>
              <h1 className={styles.title}>{`Your Favorite Recipes`}</h1>
              <RecipeList
                recipes={recipes}
                user={user}
                handleAddFavorite={handleAddToFavorites}
                handleRemoveFavorite={handleRemoveFromFavorites}
              />
            </>
          ) : (
            <h1 className={styles.title}>There are no favorite recipes</h1>
          )}
          <button
            onClick={() => router.push("/profile")}
            className={styles.backBtn}
            type={"button"}
          >
            Back to Profile
          </button>
        </div>
      </div>
    </>
  );
}
