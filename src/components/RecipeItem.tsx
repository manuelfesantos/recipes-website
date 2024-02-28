import { Recipe } from "@/types/recipes";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/RecipeItem.module.css";
import { UserDTO } from "@/types/user";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface Props {
  recipe: Recipe;
  user: UserDTO | null;
  addToFavorites: (recipe: Recipe) => Promise<void>;
  removeFromFavorites: (recipe: Recipe) => Promise<void>;
}

export default function RecipeItem({
  recipe,
  user,
  addToFavorites,
  removeFromFavorites,
}: Props) {
  const imageLoader = () => recipe.image;
  const router = useRouter();
  const [isFavorite, setFavorite] = useState(false);

  const addFavorite = async () => {
    if (user) {
      setFavorite(true);
      saveCurrentRecipe();
      await addToFavorites(recipe);
    }
  };

  const removeFavorite = async () => {
    if (user) {
      setFavorite(false);
      await removeFromFavorites(recipe);
    }
  };

  const isUserFavorite = () => {
    if (user && user.recipes)
      return user.recipes.some((userRecipe) => userRecipe.uri === recipe.uri);
    else return false;
  };

  const saveCurrentRecipe = () => {
    sessionStorage.setItem("currentRecipe", recipe.uri.slice(51));
  };

  useEffect(() => {
    if (user) {
      setFavorite(isUserFavorite());
    }
  }, [user, recipe]);
  return (
    <div className={styles.recipeCard}>
      <Link
        onClick={() =>
          sessionStorage.setItem("currentRecipe", recipe.uri.slice(51))
        }
        className={styles.link}
        href={`/recipe/${recipe.uri.slice(51)}`}
      >
        <div id={recipe.uri.slice(51)} className={styles.recipeDiv}>
          <div className={styles.overlay}></div>
          <Image
            className={styles.img}
            loader={imageLoader}
            placeholder={"blur"}
            blurDataURL={"/Rolling-1s-460px.gif"}
            width={300}
            height={400}
            src={recipe.image}
            alt={recipe.label}
          />
          <div className={styles.text}>
            <h2 className={styles.title}>
              {recipe.label.length > 35
                ? recipe.label.substring(0, 35).concat("...")
                : recipe.label}
            </h2>
            <ul className={styles.recipeDetails}>
              <li>{recipe.calories.toFixed(0)} calories</li>
              <li>|</li>
              <li>{recipe.ingredientLines.length} ingredients</li>
            </ul>
          </div>
        </div>
      </Link>
      <div className={`${styles.favorite} `}>
        <FontAwesomeIcon
          className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : styles.isNotFavorite}`}
          icon={faHeart}
          onClick={
            user
              ? isFavorite
                ? removeFavorite
                : addFavorite
              : async () => {
                  saveCurrentRecipe();
                  await router.push("/login");
                }
          }
        />
      </div>
    </div>
  );
}
