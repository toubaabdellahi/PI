import React from 'react'; // Add this line
// // src/pages/GoogleAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      //  On attend un petit délai pour laisser l'URL se charger correctement
      setTimeout(() => { }, 1000);
    }
  }, [navigate]);

  return <p>Connexion avec Google en cours...</p>;
}

export default GoogleAuthSuccess;
