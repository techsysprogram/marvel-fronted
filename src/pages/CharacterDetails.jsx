import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import FavoriteHeart from "../components/FavoriteHeart";

import Modal from "../components/Modal";

import axios from "axios";

const CharacterDetails = () => {
  let textoInfo = "Comics Associés";
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics/${id}`
        );
        setCharacter(response.data);
        setComics(response.data.comics);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchCharacterDetails();
  }, [id]);

  if (!character) {
    return <div>Chargement des détails du personnage...</div>;
  }

  // Afficher les séries si le personnage n'a pas de comics
  if (comics.length === 0) {
    textoInfo = "Pas de comics associés pour ce personnage";
  }

  const openModal = (comic) => {
    setSelectedComic(comic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComic(null);
  };

  return (
    <div className="details-container">
      {/* Bouton retour */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Détails du personnage */}
      <div className="character-details">
        <div className="character-hero">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="character-image"
          />
          <div className="character-hero-content">
            <h1>{character.name}</h1>
            <p>{character.description || "Aucune description disponible."}</p>
          </div>
        </div>

        {/* Section Comics */}
        <div className="comics-section">
          <h2>{textoInfo}</h2>
          <div className="groupe-cards">
            {comics.map((comic) => (
              <div className="card" key={comic._id}>
                <FavoriteHeart characterOrComic={"comics"} itemId={comic._id} />
                <div
                  className="card-content"
                  onClick={() => {
                    openModal(comic);
                  }}
                >
                  <img
                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    alt={comic.title}
                  />
                  <h3>{comic.title}</h3>
                  <p>{comic.description || "Aucune description disponible."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} comic={selectedComic} />
    </div>
  );
};

export default CharacterDetails;
