import styles from "@/styles/RecipePage.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

interface Props {
  handleAddToFavorites: () => Promise<void>;
  handleRemoveFromFavorites: () => Promise<void>;
  favorite: boolean;
  isLoggedIn: boolean;
}

export default function FavoritesButton({
  handleAddToFavorites,
  handleRemoveFromFavorites,
  favorite,
  isLoggedIn,
}: Props) {
  const [isFavorite, setFavorite] = useState<boolean>(favorite);
  const router = useRouter();

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
      onClick={
        isLoggedIn
          ? isFavorite
            ? removeFromFavorites
            : addToFavorites
          : () => router.push("/login")
      }
    >
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}
