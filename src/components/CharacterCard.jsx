import "./styles/Card.css";
import { Link } from "react-router-dom";

import FavoriteHeart from "./FavoriteHeart";

const CharacterCard = ({ character }) => {
  return (
    <div className="card">
      <FavoriteHeart
        characterOrComic={"characters"}
        itemId={character._id}
      />
      <Link to={`/character/${character._id}`} className="card-content">
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
        />
        <h3>{character.name}</h3>
        <p>{character.description || "Aucune description disponible."}</p>
      </Link>
    </div>
  );
};

export default CharacterCard;
