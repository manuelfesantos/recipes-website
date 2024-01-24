import { Recipe } from "@/types/recipes";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/RecipeItem.module.css";

export default function RecipeItem(props: Recipe) {
  return (
    <Link className={styles.link} href={`./recipe/${props.uri.slice(51)}`}>
      <div className={styles.recipeDiv}>
        <div className={styles.overlay}></div>
        <img className={styles.img} src={props.image} alt={props.label} />
        <div className={styles.text}>
          <h2 className={styles.title}>{props.label}</h2>
          <ul className={styles.recipeDetails}>
            <li>{props.calories.toFixed(0)} calories</li>
            <li>|</li>
            <li>{props.ingredientLines.length} ingredients</li>
          </ul>
        </div>
      </div>
    </Link>
  );
}
