import styles from "@/styles/RecipePage.module.css";

interface Props {
  title: string;
  image: string;
}
export default function RecipeProfile({ title, image }: Props) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <img className={styles.img} alt={title} src={image} />
    </>
  );
}
