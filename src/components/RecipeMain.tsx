import { useEffect, useState } from "react";
import { Recipe, RecipeListResponse } from "@/types/recipes";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "@/styles/HomePage.module.css";
import SearchHeader from "@/components/SearchHeader";
import RecipeList from "@/components/RecipeList";
import Link from "next/link";
import { UserDTO } from "@/types/user";

interface Props {
  user: UserDTO | null;
}
export default function RecipeMain({ user }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [nextRecipes, setNextRecipes] = useState<string>("");
  const [isLoaded, setLoaded] = useState(false);
  const [userDTO, setUserDTO] = useState<UserDTO | null>(user);
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

  const loadMoreRecipes = async (href: string) => {
    if (href) {
      const headers = new Headers();
      headers.append("href", href);
      const responsePromise = await fetch(`/api/recipes/next`, {
        headers: headers,
      });
      const response = await responsePromise.json();
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

  const handleAddToFavorites = async (recipe: Recipe) => {
    if (userDTO && userDTO.recipes) {
      const userToSave: UserDTO = {
        username: userDTO.username,
        _id: userDTO._id,
        recipes: [...userDTO.recipes, recipe],
      };
      await updateUser(userToSave);
    }
  };

  const handleRemoveFromFavorites = async (recipe: Recipe) => {
    if (userDTO && userDTO.recipes) {
      const userToSave: UserDTO = {
        username: userDTO.username,
        _id: userDTO._id,
        recipes: userDTO.recipes.filter(
          (userRecipe) => userRecipe.uri !== recipe.uri,
        ),
      };
      await updateUser(userToSave);
    }
  };

  const updateUser = async (userToSave: UserDTO) => {
    const responsePromise = await fetch(`/api/users/${userToSave._id}`, {
      method: "PUT",
      body: JSON.stringify(userToSave),
    });
    const response = await responsePromise.json();
    if (response.status === 202) {
      setUserDTO(response.user);
    }
  };

  useEffect(() => {
    if (!userDTO) {
      setUserDTO(user);
    }
    if (!recipes.length) {
      const parsedRecipes = JSON.parse(
        sessionStorage.getItem("recipes")!,
      ) as Recipe[];
      if (parsedRecipes) {
        setRecipes(parsedRecipes);
      }
      const nextRecipesLink = sessionStorage.getItem("next-recipes") ?? "";
      if (nextRecipesLink) {
        setNextRecipes(nextRecipesLink);
      }
    } else if (!isLoaded) {
      const id = sessionStorage.getItem("currentRecipe");
      if (id) {
        const target = document.getElementById(`${id}`);
        if (target) {
          target.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
        }
      }
      setLoaded(true);
    }
  }, [recipes, isLoaded]);

  return (
    <>
      <InfiniteScroll
        dataLength={recipes.length}
        next={() => loadMoreRecipes(nextRecipes)}
        hasMore={nextRecipes.length > 0}
        loader={<h3> Loading...</h3>}
      >
        <div className={styles.homeDiv}>
          <SearchHeader handleLoadRecipes={loadRecipes} />
          {!userDTO && <p>Login to add recipes to your favorites</p>}
          <RecipeList
            recipes={recipes}
            user={userDTO}
            handleAddFavorite={(recipe) => handleAddToFavorites(recipe)}
            handleRemoveFavorite={(recipe) => handleRemoveFromFavorites(recipe)}
          />
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
