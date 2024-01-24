import { Ingredient } from "@/types/recipes";
import IngredientItem from "@/components/IngredientItem";
import styles from "@/styles/IngredientList.module.css";

interface Props {
  ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: Props) {
  return (
    <div className={styles.ingredients}>
      <h2>{ingredients.length} ingredients:</h2>
      <ul className={styles.list}>
        {ingredients.map((ingredient) => (
          <li key={Math.random()}>
            <IngredientItem ingredient={ingredient} />
          </li>
        ))}
      </ul>
    </div>
  );
}
