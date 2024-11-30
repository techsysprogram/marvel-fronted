import "./styles/SearchBar.css";

const SearchBar = ({
  value,
  onChange,
  limit,
  onLimitChange,
  page,
  onPageChange,
  totalCount,
}) => {
  const totalPages = Math.ceil(totalCount / limit); // Calcul du nombre total de pages

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    onLimitChange(newLimit); // Change la limite
    onPageChange(1); // Réinitialise à la première page
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1); // Passe à la page suivante
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1); // Revient à la page précédente
    }
  };

  return (
    <div className="search-bar">
      {/* Contrôles de pagination */}
      <div className="pagination-controls">
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <span>Résultats par page : </span>

        <section>
          <select value={limit} onChange={handleLimitChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </section>

        <section>
          <button onClick={handlePrevPage} disabled={page === 1}>
            {"<"}
          </button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            {">"}
          </button>
        </section>
        <span>Total des résultats : {totalCount}</span>
      </div>
    </div>
  );
};

export default SearchBar;
