import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/Header.css";
import ModalLogin from "../components/ModalLogin";
import ModalSignup from "../components/ModalSignup";
import imgMarvel from "../assets/img/marvel-logo.svg";
 
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const location = useLocation();

  return (
    <section>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={imgMarvel} alt="Marvel Logo" />
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
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
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
          <li>
            <Link  onClick={() => setShowLoginModal(true)}>Login</Link>
          </li>
        </ul>
      </nav>

      {showLoginModal && (
        <ModalLogin
          onClose={() => setShowLoginModal(false)}
          openSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          handleConnexionStatus={(token) => console.log("Token reçu :", token)}
          urlGlobal="https://api.example.com"
        />
      )}

      {showSignupModal && (
        <ModalSignup
          onClose={() => setShowSignupModal(false)}
          openLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          handleConnexionStatus={(token) => console.log("Token reçu :", token)}
          urlGlobal="https://api.example.com"
        />
      )}
    </section>
  );
};

export default Header;
