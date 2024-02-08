import { Ingredient } from "@/types/recipes";
import styles from "@/styles/IngredientItem.module.css";
import Image from "next/image";
interface Props {
  ingredient: Ingredient;
}

export default function IngredientItem({ ingredient }: Props) {
  return (
    <div className={styles.ingredientItem}>
      <img
        className={styles.img}
        src={ingredient.image}
        alt={ingredient.text}
      />
      <p>{ingredient.text}</p>
    </div>
  );
}
