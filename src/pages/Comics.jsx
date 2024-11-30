import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import Modal from "../components/Modal";
import Loader from "../components/Loader"; // Import du Loader
import Notification from "../components/Notification"; // Import du Notification

const Comics = ({ search, limit, page, setTotalCount }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  const fetchComics = async () => {
    setLoading(true);
    try {
      const skip = page;
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const url = `${baseURL}/comics?limit=${limit}&page=${skip}${
        search ? `&title=${search}` : ""
      }`;

      const response = await axios.get(url);

      setComics(response.data.results);
      setTotalCount(response.data.count);

      setError(null); // Réinitialise les erreurs si la requête réussit
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComics();
  }, [search, limit, page]);

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
    <div className="details-container">
      {loading && <Loader />} {/* Affiche le Loader si loading est true */}

      {/* Affiche la notification en cas d'erreur */}
      {error && (
        <Notification
          message={`Erreur : ${error}`}
          type="error"
          onClose={handleCloseNotification}
        />
      )}

      <div className="groupe-cards">
        {comics.map((comic) => (
          <ComicCard key={comic._id} comic={comic} onClick={openModal} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} comic={selectedComic} />
    </div>
  );
};

export default Comics;
