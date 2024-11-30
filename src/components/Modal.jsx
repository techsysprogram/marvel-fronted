import "./styles/Modal.css"; // Fichier CSS dédié pour la modale
import FavoriteHeart from "./FavoriteHeart"; // Importer le cœur favori

const Modal = ({ isOpen, onClose, comic }) => {
  if (!isOpen || !comic) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <img
            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
            alt={comic.title}
            className="modal-image"
          />
          <div className="conteneur-scroll">
            <div className="modal-content-text">
              <h2>{comic.title}</h2>
              <p>{comic.description || "Aucune description disponible."}</p>
            </div>
          </div>
          {/* Cœur favori dans la modale */}
          <div className="modal-favorite">
            <FavoriteHeart characterOrComic={"comics"} itemId={comic._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
