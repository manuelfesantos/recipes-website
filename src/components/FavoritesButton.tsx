import styles from "@/styles/RecipePage.module.css";
import { useState } from "react";

interface Props {
  handleAddToFavorites: () => Promise<void>;
  handleRemoveFromFavorites: () => Promise<void>;
  favorite: boolean;
}

export default function FavoritesButton({
  handleAddToFavorites,
  handleRemoveFromFavorites,
  favorite,
}: Props) {
  const [isFavorite, setFavorite] = useState<boolean>(favorite);

  const addToFavorites = async () => {
    setFavorite(true);
    await handleAddToFavorites();
  };

  const removeFromFavorites = async () => {
    setFavorite(false);
    await handleRemoveFromFavorites();
  };

  return (
    <button
      className={styles.link}
      onClick={isFavorite ? removeFromFavorites : addToFavorites}
    >
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}
