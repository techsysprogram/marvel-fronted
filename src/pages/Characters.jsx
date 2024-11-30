import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";

const Characters = ({ search, limit, page, setTotalCount }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/characters?limit=${limit}&page=${page}${
          search ? `&name=${search}` : ""
        }`
      );

      // Met à jour les personnages et le total des résultats
      setCharacters(response.data.results);
      setTotalCount(response.data.count); // Passe totalCount à App.jsx
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [search, limit, page]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <div className="characters-container">
      <div className="groupe-cards">
        {characters.map((character) => (
          <CharacterCard key={character._id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default Characters;
