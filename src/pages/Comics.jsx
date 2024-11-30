import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import Modal from "../components/Modal";

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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="details-container">
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
