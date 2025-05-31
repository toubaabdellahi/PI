import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-up", { replace: true });
  };

  return (
    <div>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Bienvenue sur la page d'accueil !
          <button onClick={handleLogout}>Déconnexion</button>
        </Typography>
      </Box>{" "}
    </div>
  );
}
