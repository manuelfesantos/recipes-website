import { RecipeDetails, RecipeItemWrapper, RecipeListResponse } from "@/types/recipes";
import { AppConfig } from "@/types/app-config";

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
};

const appConfigs: AppConfig[] = [
  { appId: "bc78b6ba", appKey: "d2cd5dbf19e4e2e6d703b72b1203bc7f" },
  { appId: "48d1a496", appKey: "20e7f3ef09443ba504793a71e1f6ec31" },
  { appId: "7814c164", appKey: "11deeae5c25b3d8b217c8620dd3ea712" },
  { appId: "237fcaca", appKey: "3f25aec551cb19df198259a90c15c775" },
  { appId: "3761ecf9", appKey: "b689da2e119484754301272bb4a069db" },
];

const baseEndpoint = "https://www.edamam.com/api/recipes/v2";

export const getRecipesBySearchWord = async (searchWord: string): Promise<RecipeListResponse> => {
  return getRecipesByHref(buildHrefFromSearchWord(searchWord));
};

export const getRecipesByHref = async (href: string): Promise<RecipeListResponse> => {
  const appConfig: AppConfig = getAppConfigFromHref(href);
  const newHref = replaceAppConfigs(href, appConfig);
  console.log(`new href: ${newHref}`);
  const apiResponse = fetch(newHref, requestOptions);
  return parseResponse(apiResponse) as Promise<RecipeListResponse>;
};

export const getSingleRecipeById = async (id: string): Promise<RecipeDetails> => {
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

const parseResponse = async (response: Promise<Response>): Promise<RecipeListResponse | RecipeDetails> => {
  const result = (await response).text();
  return JSON.parse(await result);
};
