import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/Header.css";
import ModalLogin from "../components/ModalLogin";
import ModalSignup from "../components/ModalSignup";
import Notification from "../components/Notification";
import Loader from "../components/Loader";
import imgMarvel from "../assets/img/marvel-logo.svg";
import Cookies from "js-cookie";
import axios from "axios";
import { LogIn, LogOut } from "lucide-react";

const Header = ({ onLoginSuccess }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [token, setToken] = useState(Cookies.get("marvel-token") || null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fonction pour charger les données
  const fetchFavorites = async (prevToken) => {
    if (!token && !prevToken) return;

    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/favorite/get`, {
        headers: {
          Authorization: `Bearer ${token || prevToken}`,
        },
      });
      const { characters, comics } = response.data;
      localStorage.setItem("favorites-characters", JSON.stringify(characters));
      localStorage.setItem("favorites-comics", JSON.stringify(comics));
    } catch (err) {
      setNotification({
        message: "Erreur lors du chargement des favoris.",
        type: "error",
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la navigation entre les pages
  useEffect(() => {
    if (location.pathname === "/favorites") {
      fetchFavorites();
    }
  }, [location.pathname]);

  const handleConnexionStatus = async (token) => {
    if (token === null) {
      Cookies.remove("marvel-token");
      setNotification({
        message: "Vous êtes déconnecté(e)",
        type: "error",
        visible: true,
      });
    } else {
      Cookies.set("marvel-token", token, { expires: 14 }); // expire dans 14 jours

      try {
        setNotification({
          message: "Connexion réussie ! Bienvenue.",
          type: "success",
          visible: true,
        });

        await fetchFavorites(token); // Attendre que fetchFavorites se termine

        // Vérifier si onLoginSuccess est défini et l'exécuter après le chargement des favoris
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } catch (error) {
        setNotification({
          message: "Une erreur est survenue lors du chargement des favoris.",
          type: "error",
          visible: true,
        });
      }
    }
    setToken(token);
  };

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

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
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => setMenuOpen(false)} // Ferme le menu
            >
              Personnages
            </Link>
          </li>
          <li>
            <Link
              to="/comics"
              className={location.pathname === "/comics" ? "active" : ""}
              onClick={() => setMenuOpen(false)} // Ferme le menu
            >
              Comics
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={location.pathname === "/favorites" ? "active" : ""}
              onClick={() => setMenuOpen(false)} // Ferme le menu
            >
              Favoris
            </Link>
          </li>
          <li>
            {token ? (
              <Link
                className="logout-link" // Ajout de la classe pour le style Déconnexion
                onClick={() => {
                  handleConnexionStatus(null); // Déconnexion
                  navigate("/"); // Retour à l'accueil après déconnexion
                  setMenuOpen(false); // Ferme le menu
                }}
              >
                <LogOut size={18} /> Déconnexion
              </Link>
            ) : (
              <Link
                className="login-link" // Ajout de la classe pour le style Login
                onClick={() => {
                  setShowLoginModal(true);
                  setMenuOpen(false); // Ferme le menu
                }}
              >
                <LogIn size={18} /> Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
      {loading && <Loader />} {/* Affiche le Loader si loading est true */}
      {showLoginModal && (
        <ModalLogin
          onClose={() => setShowLoginModal(false)}
          openSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          handleConnexionStatus={handleConnexionStatus}
        />
      )}
      {showSignupModal && (
        <ModalSignup
          onClose={() => setShowSignupModal(false)}
          openLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          handleConnexionStatus={handleConnexionStatus}
        />
      )}
      {/* Notification */}
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </section>
  );
};

export default Header;
