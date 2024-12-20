import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import Modal from "../components/Modal";
import CharacterCard from "../components/CharacterCard";
import Loader from "../components/Loader"; // Import du composant Loader
import Notification from "../components/Notification"; // Import du composant Notification

const Favorites = ({ token }) => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("select-favorie") || "characters"
  );
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

  useEffect(() => {
    localStorage.setItem("select-favorie", activeTab);
  }, [activeTab]);

  return (
    <div className="favorites-container">
      {loading && <Loader />}

      {error && (
        <Notification
          message={`Erreur : ${error}`}
          type="error"
          onClose={handleCloseNotification}
        />
      )}

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

          {activeTab === "characters" ? (
            favoritesCharacters.length > 0 ? (
              <div className="groupe-cards">
                {favoritesCharacters.map((character) => (
                  <CharacterCard
                    key={character._id}
                    character={character}
                    token={token}
                  />
                ))}
              </div>
            ) : (
              <p>Aucun personnage favori.</p>
            )
          ) : favoritesComics.length > 0 ? (
            <div className="groupe-cards">
              {favoritesComics.map((comic) => (
                <ComicCard
                  key={comic._id}
                  comic={comic}
                  onClick={openModal}
                  token={token}
                />
              ))}
            </div>
          ) : (
            <p>Aucun comic favori.</p>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} comic={selectedComic} />
    </div>
  );
};

export default Favorites;
