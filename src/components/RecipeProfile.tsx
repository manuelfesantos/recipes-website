import styles from "@/styles/RecipePage.module.css";

interface Props {
  title: string;
}
export default function RecipeProfile({ title }: Props) {
  return <h1 className={styles.title}>{title}</h1>;
}
