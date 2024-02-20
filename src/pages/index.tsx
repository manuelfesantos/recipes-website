import Head from "next/head";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipes";
import RecipeList from "@/components/RecipeList";
import SearchHeader from "@/components/SearchHeader";
import { getRecipesByHref, getRecipesBySearchWord } from "@/utils/api-client";
import styles from "@/styles/HomePage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Header from "@/components/Header";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [nextRecipes, setNextRecipes] = useState<string>("");
  const loadRecipes = async (searchText: string) => {
    setNextRecipes("");
    const recipesList = await getRecipesBySearchWord(searchText);
    const recipes = recipesList.hits.map((r) => r.recipe);
    if (recipes) {
      const nextRecipesLink = recipesList._links.next?.href;

      if (nextRecipesLink) {
        sessionStorage.setItem("next-recipes", nextRecipesLink);
        setNextRecipes(nextRecipesLink);
      }

      sessionStorage.setItem("search-text", searchText);
      sessionStorage.setItem("recipes", JSON.stringify(recipes));
      setRecipes(recipes);
    }
  };

  useEffect(() => {
    const recipes = JSON.parse(sessionStorage.getItem("recipes")!) as Recipe[];
    if (recipes) {
      setRecipes(recipes);
    }
    const nextRecipesLink = sessionStorage.getItem("next-recipes") ?? "";
    if (nextRecipesLink) {
      setNextRecipes(nextRecipesLink);
    }
  }, []);
  const loadMoreRecipes = async (href: string) => {
    if (nextRecipes) {
      const newRecipeList = await getRecipesByHref(href);
      if (newRecipeList._links.next) {
        sessionStorage.setItem("next-recipes", newRecipeList._links.next.href);
      }
      const newRecipes = newRecipeList.hits.map((hit) => hit.recipe);
      setRecipes((prevState) => {
        const savedRecipes = [...prevState, ...newRecipes];
        sessionStorage.setItem("recipes", JSON.stringify(savedRecipes));
        return savedRecipes;
      });
      const newRecipeLink = newRecipeList._links.next?.href;
      if (newRecipeLink) {
        setNextRecipes(newRecipeLink);
      } else {
        setNextRecipes("");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <InfiniteScroll
        dataLength={recipes.length}
        next={() => loadMoreRecipes(nextRecipes)}
        hasMore={nextRecipes.length > 0}
        loader={<h3> Loading...</h3>}
      >
        <div className={styles.homeDiv}>
          <SearchHeader handleLoadRecipes={loadRecipes} />
          <RecipeList recipes={recipes} />
        </div>
        <Link href={"https://www.edamam.com/"} target={"_blank"}>
          <img
            className={
              recipes.length > 0 ? styles.edamamBadge : styles.edamamBadgeBottom
            }
            src="/edamam-badge.svg"
          />
        </Link>
      </InfiniteScroll>
    </>
  );
}
