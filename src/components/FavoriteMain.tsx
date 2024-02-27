import RecipeList from "@/components/RecipeList";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipes";
import { UserDTO } from "@/types/user";

interface Props {
  user: UserDTO;
}
export default function FavoriteMain({ user }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(user.recipes);

  const handleAddToFavorites = async (recipe: Recipe) => {
    console.log("adding recipe");
    const userToSave: UserDTO = {
      username: user.username,
      _id: user._id,
      recipes: [...user.recipes, recipe],
    };
    await updateUser(userToSave);
  };

  const handleRemoveFromFavorites = async (recipe: Recipe) => {
    console.log("removing recipe");
    const userToSave: UserDTO = {
      username: user.username,
      _id: user._id,
      recipes: recipes.filter((userRecipe) => userRecipe.uri !== recipe.uri),
    };
    await updateUser(userToSave);
  };

  const updateUser = async (userToSave: UserDTO) => {
    setRecipes(userToSave.recipes);
    const responsePromise = await fetch(`/api/users/${userToSave._id}`, {
      method: "PUT",
      body: JSON.stringify(userToSave),
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
        target.scrollIntoView();
      }
    }
  }, []);

  return (
    <>
      <h1>{user.username}</h1>
      <RecipeList
        recipes={recipes}
        user={user}
        handleAddFavorite={handleAddToFavorites}
        handleRemoveFavorite={handleRemoveFromFavorites}
      />
    </>
  );
}
