import "./styles/Card.css";
import FavoriteHeart from "../components/FavoriteHeart";

const ComicCard = ({ comic, onClick  }) => {
  return (
    <div className="card">
      <FavoriteHeart characterOrComic={"comics"} itemId={comic._id}/>
      <div className="card-content" onClick={() => onClick(comic)}>
        <img
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          alt={comic.title}
        />
        <h3>{comic.title}</h3>
        <p>{comic.description || "Aucune description disponible."}</p>
      </div>
    </div>
  );
};

export default ComicCard;
