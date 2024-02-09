import { Recipe } from "@/types/recipes";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/RecipeItem.module.css";

export default function RecipeItem(props: Recipe) {
  const id = props.uri.slice(51);
  const imageLoader = () => props.image;
  return (
    <Link className={styles.link} href={`./recipe/${id}`}>
      <div id={id} className={styles.recipeDiv}>
        <div className={styles.overlay}></div>
        <Image
          className={styles.img}
          loader={imageLoader}
          placeholder={"blur"}
          blurDataURL={"/Rolling-1s-460px.gif"}
          width={300}
          height={400}
          src={props.image}
          alt={props.label}
        />
        <div className={styles.text}>
          <h2 className={styles.title}>
            {props.label.length > 35
              ? props.label.substring(0, 35).concat("...")
              : props.label}
          </h2>
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
