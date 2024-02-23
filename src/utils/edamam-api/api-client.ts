import { RecipeDetails, RecipeListResponse } from "@/types/recipes";
import { AppConfig } from "@/types/app-config";
import process from "process";

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
};

const env = process.env;

const appConfigs: AppConfig[] = [
  { appId: `${env.RECIPES_APP_ID_1}`, appKey: `${env.RECIPES_APP_KEY_1}` },
  { appId: `${env.RECIPES_APP_ID_2}`, appKey: `${env.RECIPES_APP_KEY_2}` },
  { appId: `${env.RECIPES_APP_ID_3}`, appKey: `${env.RECIPES_APP_KEY_3}` },
  { appId: `${env.RECIPES_APP_ID_4}`, appKey: `${env.RECIPES_APP_KEY_4}` },
  { appId: `${env.RECIPES_APP_ID_5}`, appKey: `${env.RECIPES_APP_KEY_5}` },
];

const baseEndpoint = "https://www.edamam.com/api/recipes/v2";

export const getRecipesBySearchWord = async (
  searchWord: string,
): Promise<RecipeListResponse> => {
  return getRecipesByHref(buildHrefFromSearchWord(searchWord));
};

export const getRecipesByHref = async (
  href: string,
): Promise<RecipeListResponse> => {
  const appConfig: AppConfig = getAppConfigFromHref(href);
  const newHref = replaceAppConfigs(href, appConfig);
  console.log(`new href: ${newHref}`);
  const apiResponse = fetch(newHref, requestOptions);
  return parseResponse(apiResponse) as Promise<RecipeListResponse>;
};

export const getSingleRecipeById = async (
  id: string,
): Promise<RecipeDetails> => {
  const apiResponse = fetch(buildHrefFromRecipeId(id), requestOptions);
  return parseResponse(apiResponse) as Promise<RecipeDetails>;
};

const getRandomAppConfig = (): AppConfig =>
  appConfigs[Math.floor(Math.random() * appConfigs.length)];

const buildHrefFromSearchWord = (searchWord: string) => {
  const appConfig = getRandomAppConfig();
  const href = `${baseEndpoint}?type=public&q=${searchWord}&field=uri&field=label&field=image&field=calories&field=yield&field=source&field=ingredientLines&_=1705801581468&app_id=${appConfig.appId}&app_key=${appConfig.appKey}`;
  console.log(`href: ${href}`);
  return href;
};

const getAppConfigFromHref = (href: string): AppConfig => {
  const query = href.split("?")[1];
  return {
    appId: findQueryParam(query, "app_id"),
    appKey: findQueryParam(query, "app_key"),
  };
};

const replaceAppConfigs = (href: string, appConfig: AppConfig): string => {
  const newAppConfig = getRandomAppConfig();
  return href
    .replace(appConfig.appId, newAppConfig.appId)
    .replace(appConfig.appKey, newAppConfig.appKey);
};

const findQueryParam = (query: string, paramTitle: string): string => {
  return (
    query
      .split("&")
      .find((field) => field.startsWith(paramTitle))
      ?.split("=")[1] ?? ""
  );
};

const buildHrefFromRecipeId = (id: string): string => {
  const appConfig = getRandomAppConfig();
  const href = `${baseEndpoint}/${id}?type=public&_=
d2cd5dbf19e4e2e6d703b72b1203bc7f&app_id=${appConfig.appId}&app_key=${appConfig.appKey}`;
  console.log(`href: ${href}`);
  return href;
};

const parseResponse = async (
  response: Promise<Response>,
): Promise<RecipeListResponse | RecipeDetails> => {
  const result = (await response).text();
  return JSON.parse(await result);
};
