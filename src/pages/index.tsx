import Head from "next/head";
import { useEffect, useState } from "react";
import { Recipe, RecipeListResponse } from "@/types/recipes";
import RecipeList from "@/components/RecipeList";
import SearchHeader from "@/components/SearchHeader";
import styles from "@/styles/HomePage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Header from "@/components/Header";
import { getCookie } from "cookies-next";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [nextRecipes, setNextRecipes] = useState<string>("");
  const [isLoggedIn] = useState<boolean>(Boolean(getCookie("user")));
  const loadRecipes = async (searchText: string) => {
    setNextRecipes("");
    const responsePromise = await fetch(`/api/recipes/${searchText}`);
    const response = await responsePromise.json();
    if (response.status === 200) {
      const recipesList = response.recipes as RecipeListResponse;
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
    if (href) {
      const headers = new Headers();
      headers.append("href", href);
      const responsePromise = await fetch(`/api/recipes/next`, {
        headers: headers,
      });
      const response = await responsePromise.json();
      console.log(response);
      if (response.status === 200) {
        const newRecipeList = response.recipes as RecipeListResponse;
        if (newRecipeList._links.next) {
          sessionStorage.setItem(
            "next-recipes",
            newRecipeList._links.next.href,
          );
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
          {!isLoggedIn && <h1>Login to add recipes to your favorites</h1>}
          <RecipeList recipes={recipes} isLoggedIn={isLoggedIn} />
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
