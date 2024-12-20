import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import "./styles/FavoriteHeart.css";
import Cookies from "js-cookie";

const FavoriteHeart = ({ characterOrComic, itemId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const favorites =
      JSON.parse(localStorage.getItem(`favorites-${characterOrComic}`)) || [];
    setIsFavorite(favorites.includes(itemId));
  }, [itemId, characterOrComic]);

  const toggleFavorite = async () => {
    const favorites =
      JSON.parse(localStorage.getItem(`favorites-${characterOrComic}`)) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((id) => id !== itemId);
    } else {
      updatedFavorites = [...favorites, itemId];
    }

    localStorage.setItem(
      `favorites-${characterOrComic}`,
      JSON.stringify(updatedFavorites)
    );

    setIsFavorite(!isFavorite);

    //avant de sauvegarder les favoris, on vérifie si l'utilisateur est connecté
    const token = Cookies.get("marvel-token");
    if (token) {
      setLoading(true);
      try {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        await axios.post(
          `${baseURL}/favorite/save`,
          {
            characters:
              characterOrComic === "characters"
                ? updatedFavorites
                : JSON.parse(localStorage.getItem("favorites-characters")) ||
                  [],
            comics:
              characterOrComic === "comics"
                ? updatedFavorites
                : JSON.parse(localStorage.getItem("favorites-comics")) || [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        setError("Erreur lors de la sauvegarde des favoris.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <Loader />}
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <button
        onClick={toggleFavorite}
        className={`favorite-heart ${isFavorite ? "active" : ""}`}
        aria-label="Toggle Favorite"
      >
        <Heart />
      </button>
    </>
  );
};

export default FavoriteHeart;
