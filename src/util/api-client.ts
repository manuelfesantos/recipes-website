import {
  RecipeDetails,
  RecipeItemWrapper,
  RecipeListResponse,
} from "@/types/recipes";

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
};

export const getRecipesBySearchWord = async (searchWord: string) =>
  getRecipesByHref(
    `https://www.edamam.com/api/recipes/v2?type=public&q=${searchWord}&field=uri&field=label&field=image&field=calories&field=yield&field=source&field=ingredientLines&_=1705801581468&app_id=bc78b6ba&app_key=d2cd5dbf19e4e2e6d703b72b1203bc7f`,
  );

export const getRecipesByHref = async (href: string) => {
  const apiResult = fetch(href, requestOptions);
  const recipes = (await apiResult).text();
  console.log(recipes);
  const parsedRecipes: RecipeListResponse = JSON.parse(await recipes);
  return parsedRecipes;
};

export const getSingleRecipe = async (id: string) => {
  const singleApiResult = fetch(
    `https://www.edamam.com/api/recipes/v2/${id}?type=public&_=
d2cd5dbf19e4e2e6d703b72b1203bc7f&app_id=bc78b6ba&app_key=d2cd5dbf19e4e2e6d703b72b1203bc7f`,
    requestOptions,
  );
  const recipe = (await singleApiResult).text();
  const parsedRecipe: RecipeItemWrapper = JSON.parse(await recipe);
  return parsedRecipe;
};
