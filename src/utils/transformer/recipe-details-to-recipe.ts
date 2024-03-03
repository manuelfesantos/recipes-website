import { Recipe, RecipeDetails } from "@/types/recipes";

export const buildRecipeFromRecipeDetails = (
  recipeDetails: RecipeDetails,
): Recipe => ({
  calories: recipeDetails.calories,
  image: recipeDetails.image,
  ingredientLines: recipeDetails.ingredientLines,
  label: recipeDetails.label,
  source: recipeDetails.source,
  uri: recipeDetails.uri,
  yield: recipeDetails.yield,
});
