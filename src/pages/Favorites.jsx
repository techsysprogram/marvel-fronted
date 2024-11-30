import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import Modal from "../components/Modal";
import CharacterCard from "../components/CharacterCard";

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
      const favoritesCharactersIds =
        JSON.parse(localStorage.getItem("favorites-characters")) || [];
      const favoritesComicsIds =
        JSON.parse(localStorage.getItem("favorites-comics")) || [];

      const charactersPromises = favoritesCharactersIds.map((id) =>
        axios.get(`http://localhost:3000/character/${id}`)
      );
      const comicsPromises = favoritesComicsIds.map((id) =>
        axios.get(`http://localhost:3000/comic/${id}`)
      );

      const charactersResponses = await Promise.all(charactersPromises);
      const comicsResponses = await Promise.all(comicsPromises);

      setFavoritesCharacters(charactersResponses.map((res) => res.data));
      setFavoritesComics(comicsResponses.map((res) => res.data));

      setLoading(false);
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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="favorites-container">
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
              <ComicCard
                key={comic._id}
                comic={comic}
                onClick={openModal}
              />
            ))
          ) : (
            <p>Aucun comic favori.</p>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} comic={selectedComic} />
    </div>
  );
};

export default Favorites;
