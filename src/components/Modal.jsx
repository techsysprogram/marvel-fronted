import "./styles/Modal.css"; // Fichier CSS dédié pour la modale

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
        </div>
      </div>
    </div>
  );
};

export default Modal;
