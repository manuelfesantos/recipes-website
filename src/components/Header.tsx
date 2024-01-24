import { Recipe } from "@/types/recipes";
import SearchBar from "@/components/SearchBar";
import styles from "@/styles/Header.module.css";

interface Props {
  handleLoadRecipes: (searchText: string) => void;
}

export default function Header({ handleLoadRecipes }: Props) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Recipes</h1>
      <SearchBar loadRecipes={handleLoadRecipes} />
    </div>
  );
}
