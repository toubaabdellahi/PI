import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // pas de token -> rediriger vers login
    return <Navigate to="/sign-up" replace />;
  }

  // ici, tu peux aussi ajouter une vérification de validité du token JWT si tu veux

  return children;
}
export default ProtectedRoute;