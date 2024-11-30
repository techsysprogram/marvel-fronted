import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

const SearchBarWrapper = ({ search, setSearch, limit, setLimit, page, setPage, totalCount }) => {
  const location = useLocation();

  // Vérifie si la SearchBar doit être affichée
  const afficherSearchBar = !location.pathname.includes("/favorites") && !location.pathname.includes("/character");

  if (!afficherSearchBar) return null; // Ne pas afficher si on est sur la page favorites

  return (
    <SearchBar
      value={search}
      onChange={(value) => {
        setSearch(value);
        setPage(1);
      }}
      limit={limit}
      onLimitChange={setLimit}
      page={page}
      onPageChange={setPage}
      totalCount={totalCount}
    />
  );
};

export default SearchBarWrapper;
