import { Ingredient } from "@/types/recipes";
import styles from "@/styles/IngredientItem.module.css";
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
      ></img>
      <p>{ingredient.text}</p>
    </div>
  );
}
