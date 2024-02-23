import { useEffect, useRef } from "react";
import styles from "@/styles/SearchBar.module.css";
interface Props {
  loadRecipes: (searchText: string) => void;
}

export default function SearchBar({ loadRecipes }: Props) {
  const searchInput = useRef<HTMLInputElement>(null);
  const searchRecipes = async () => {
    if (searchInput.current) {
      const searchText = searchInput.current.value;
      loadRecipes(searchText);
    }
  };

  useEffect(() => {
    const searchText = sessionStorage.getItem("search-text");
    if (searchText && searchInput.current) {
      searchInput.current.value = searchText;
    }
  });
  useEffect(() => {}, []);
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.input}
        id="search"
        type="text"
        ref={searchInput}
        placeholder="What would you like to cook?"
      />
      <button className={styles.btn} type="button" onClick={searchRecipes}>
        Search Recipes
      </button>
    </div>
  );
}
