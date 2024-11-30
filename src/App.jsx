import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBarWrapper from "./components/SearchBarWrapper";

// Pages
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import CharacterDetails from "./pages/CharacterDetails";

const App = () => {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Ajuste la page si elle dépasse le total de pages disponibles
  useEffect(() => {
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) {
      setPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalCount, limit, page]);

  return (
    <Router>
      <Header />
      <div className="main-content">
        <SearchBarWrapper
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
        />
        <Routes>
          <Route
            path="/comics"
            element={
              <Comics
                search={search}
                limit={limit}
                page={page}
                setTotalCount={setTotalCount}
              />
            }
          />
          <Route path="/character/:id" element={<CharacterDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/"
            element={
              <Characters
                search={search}
                limit={limit}
                page={page}
                setTotalCount={setTotalCount}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
