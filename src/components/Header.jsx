import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/Header.css";
import imglogo from "../assets/img/marvel-logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <section>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={imglogo} alt="Marvel Logo" />
          </Link>
        </div>
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Personnages
            </Link>
          </li>
          <li>
            <Link
              to="/comics"
              className={location.pathname === "/comics" ? "active" : ""}
            >
              Comics
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={location.pathname === "/favorites" ? "active" : ""}
            >
              Favoris
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default Header;
