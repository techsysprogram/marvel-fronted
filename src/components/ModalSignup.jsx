import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Notification from "../components/Notification"; // Import du composant Notification
import "./styles/ModalLogin.css";

const ModalSignup = ({ onClose, handleConnexionStatus, openLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${baseURL}/user/signup`, formData);
      handleConnexionStatus(response.data.token);
      setSuccessMessage("Inscription réussie !");
      onClose(); // Fermer le modal après une inscription réussie
    } catch (error) {
      setErrorMessage(
        error.response?.status === 409
          ? "Cette adresse email est déjà utilisée."
          : error.response?.data?.message || "Une erreur est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="modal-overlay">
      {isLoading && <Loader />}
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-header">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="modal-body-login">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="modal-submit">
            S'inscrire
          </button>
        </form>
        <div className="modal-footer">
          <a onClick={openLogin}>Déjà un compte ? Connectez-vous.</a>
        </div>
      </div>

      {/* Notification pour les erreurs */}
      {errorMessage && (
        <Notification
          message={errorMessage}
          type="error"
          onClose={handleNotificationClose}
        />
      )}

      {/* Notification pour le succès */}
      {successMessage && (
        <Notification
          message={successMessage}
          type="success"
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default ModalSignup;
