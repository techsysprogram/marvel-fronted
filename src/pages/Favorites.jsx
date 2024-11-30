import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import Modal from "../components/Modal";
import CharacterCard from "../components/CharacterCard";
import Loader from "../components/Loader"; // Import du composant Loader
import Notification from "../components/Notification"; // Import du composant Notification

const Favorites = () => {
  const [activeTab, setActiveTab] = useState("characters");
  const [favoritesCharacters, setFavoritesCharacters] = useState([]);
  const [favoritesComics, setFavoritesComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const favoritesCharactersIds =
        JSON.parse(localStorage.getItem("favorites-characters")) || [];
      const favoritesComicsIds =
        JSON.parse(localStorage.getItem("favorites-comics")) || [];

      const charactersPromises = favoritesCharactersIds.map((id) =>
        axios.get(`${baseURL}/character/${id}`)
      );
      const comicsPromises = favoritesComicsIds.map((id) =>
        axios.get(`${baseURL}/comic/${id}`)
      );

      const charactersResponses = await Promise.all(charactersPromises);
      const comicsResponses = await Promise.all(comicsPromises);

      setFavoritesCharacters(charactersResponses.map((res) => res.data));
      setFavoritesComics(comicsResponses.map((res) => res.data));

      setLoading(false);
      setError(null); // Réinitialise l'erreur après un succès
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const openModal = (comic) => {
    setSelectedComic(comic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComic(null);
  };

  const handleCloseNotification = () => {
    setError(null); // Réinitialise l'erreur
  };

  return (
    <div className="favorites-container">
      {/* Affichage du Loader */}
      {loading && <Loader />}

      {/* Notification en cas d'erreur */}
      {error && (
        <Notification
          message={`Erreur : ${error}`}
          type="error"
          onClose={handleCloseNotification}
        />
      )}

      {/* Contenu principal */}
      {!loading && !error && (
        <>
          <div className="tabs">
            <button
              className={activeTab === "characters" ? "active" : ""}
              onClick={() => setActiveTab("characters")}
            >
              Mes personnages préférés
            </button>
            <button
              className={activeTab === "comics" ? "active" : ""}
              onClick={() => setActiveTab("comics")}
            >
              Mes comics préférés
            </button>
          </div>

          {activeTab === "characters" && (
            <div className="groupe-cards">
              {favoritesCharacters.length > 0 ? (
                favoritesCharacters.map((character) => (
                  <CharacterCard key={character._id} character={character} />
                ))
              ) : (
                <p>Aucun personnage favori.</p>
              )}
            </div>
          )}

          {activeTab === "comics" && (
            <div className="groupe-cards">
              {favoritesComics.length > 0 ? (
                favoritesComics.map((comic) => (
                  <ComicCard key={comic._id} comic={comic} onClick={openModal} />
                ))
              ) : (
                <p>Aucun comic favori.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} comic={selectedComic} />
    </div>
  );
};

export default Favorites;
