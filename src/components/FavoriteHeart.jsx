// src/components/FavoriteHeart.jsx
import { useState, useEffect } from "react";
import { Heart } from "lucide-react"; // Utilisation d'une seule icône pour le cœur rempli et vide
import "./styles/FavoriteHeart.css";

const FavoriteHeart = ({ characterOrComic, itemId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Charger l'état favori depuis le localStorage au montage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites-${characterOrComic}`)) || [];
    setIsFavorite(favorites.includes(itemId));
  }, [itemId]);

  // Ajouter ou supprimer des favoris
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem(`favorites-${characterOrComic}`)) || [];

    if (isFavorite) {
      const updatedFavorites = favorites.filter((id) => id !== itemId);
      localStorage.setItem(
        "favorites-" + characterOrComic,
        JSON.stringify(updatedFavorites)
      );
    } else {
      favorites.push(itemId);
      localStorage.setItem(
        "favorites-" + characterOrComic,
        JSON.stringify(favorites)
      );
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`favorite-heart ${isFavorite ? "active" : ""}`}
      aria-label="Toggle Favorite"
    >
      <Heart />
    </button>
  );
};

export default FavoriteHeart;
