import { getSingleRecipeById } from "@/utils/edamam-api/api-client";
import { buildRecipeFromRecipeDetails } from "@/utils/transformer/recipe-details-to-recipe";
import { idFromUri, Recipe } from "@/types/recipes";

const isImageValid = async (image: string) => {
  const { status } = await fetch(image);
  console.log(status);
  return status === 200;
};

const renewRecipeImage = async (recipe: Recipe) => {
  const id = idFromUri(recipe.uri);
  console.log("Recipe id: ", id);
  const newRecipeDetails = await getSingleRecipeById(id);
  console.log("New Recipe details: ", newRecipeDetails);
  recipe.image = newRecipeDetails.image;
  return { ...recipe, image: newRecipeDetails.recipe.image };
};

export const renewRecipeIfNeeded = async (recipe: Recipe) => {
  console.log("Recipe: ", recipe);
  if (await isImageValid(recipe.image)) return null;
  return await renewRecipeImage(recipe);
};
