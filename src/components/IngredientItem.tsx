import { Ingredient } from "@/types/recipes";
import styles from "@/styles/IngredientItem.module.css";
import Image from "next/image";
interface Props {
  ingredient: Ingredient;
}

export default function IngredientItem({ ingredient }: Props) {
  const imageLoader = () => ingredient.image ?? "/ingredient-icon-6.jpg";
  return (
    <div className={styles.ingredientItem}>
      <Image
        className={styles.img}
        loader={imageLoader}
        width={100}
        height={100}
        placeholder={"blur"}
        blurDataURL={"/Rolling-1s-460px.gif"}
        src={ingredient.image ?? "/ingredient-icon-6.jpg"}
        alt={ingredient.text}
      />
      <p>{ingredient.text}</p>
    </div>
  );
}
