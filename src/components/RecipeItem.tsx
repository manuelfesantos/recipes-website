import { Recipe } from "@/types/recipes";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/RecipeItem.module.css";

interface Props {
  recipe: Recipe;
  isLoggedIn: boolean;
}

export default function RecipeItem({ recipe, isLoggedIn }: Props) {
  const imageLoader = () => recipe.image;
  return (
    <Link className={styles.link} href={`./recipe/${recipe.uri.slice(51)}`}>
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
          {isLoggedIn && <h3>Add to favorites</h3>}
        </div>
      </div>
    </Link>
  );
}
