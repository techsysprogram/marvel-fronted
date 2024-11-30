import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Notification from "../components/Notification"; // Import du composant Notification
import "./styles/ModalLogin.css";

const ModalLogin = ({ onClose, handleConnexionStatus, urlGlobal, openSignup }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const response = await axios.post(`${urlGlobal}/user/login`, formData);
      handleConnexionStatus(response.data.token);
      setSuccessMessage("Connexion réussie !");
      onClose(); // Ferme le modal après une connexion réussie
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Une erreur est survenue."
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
        <h2 className="modal-header">Se connecter</h2>
        <form onSubmit={handleSubmit} className="modal-body-login">
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
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
            Se connecter
          </button>
        </form>
        <div className="modal-footer">
          <a onClick={openSignup}>Souhaitez-vous créer un compte ?</a>
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

export default ModalLogin;
