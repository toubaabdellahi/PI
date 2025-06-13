import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CssBaseline,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [userError, setUserError] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const GOOGLE_CLIENT_ID =
    "76497721292-2fmahu68t6r2vaiupdmq6rbbtqsm3jq5.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:8000/api/auth/login/google/callback/";

  const googleLoginUrl =
    `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=email%20profile` +
    `&access_type=offline` +
    `&prompt=consent`;

  const validateInputs = () => {
    const user = document.getElementById("usernameOrEmail");
    const password = document.getElementById("password");
    let isValid = true;

    if (!user.value || user.value.length < 3) {
      setUserError(true);
      setUserErrorMessage(
        "Veuillez entrer un nom d'utilisateur ou email valide."
      );
      isValid = false;
    } else {
      setUserError(false);
      setUserErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Mot de passe trop court (min 6 caractères).");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      identifier: data.get("usernameOrEmail"),
      password: data.get("password"),
    };

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        credentials: "include", // Inclure les cookies si nécessaires
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Erreur de connexion");
        return;
      }

      const result = await res.json();

      if (result.token) {
        //  Stocker le token JWT dans localStorage
        localStorage.setItem("token", result.token);
        
        //  Rediriger vers /home
        navigate("/home");

        //  Rediriger vers /pdf-manager
        navigate("/pdf-manager");
      } else {
        alert("Token non reçu depuis le serveur !");
      }
    } catch (error) {
      alert("Erreur réseau ou serveur.");
    }
  };
 
  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 1,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 360,
            p: 2,
            boxShadow: 3,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Stack spacing={1}>
            <Typography component="h1" variant="h5" textAlign="center" mb={1}>
              Sign in
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={1}>
                <FormControl>
                  <FormLabel
                    htmlFor="usernameOrEmail"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Email ou nom d'utilisateur
                  </FormLabel>
                  <TextField
                    name="usernameOrEmail"
                    id="usernameOrEmail"
                    placeholder="Email ou nom d'utilisateur"
                    required
                    fullWidth
                    autoComplete="username"
                    error={userError}
                    helperText={userErrorMessage}
                    size="small"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password" sx={{ fontSize: "0.9rem" }}>
                    Mot de passe
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    placeholder="••••••"
                    autoComplete="current-password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    size="small"
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Se connecter
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                ou
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => {
                window.location.href = googleLoginUrl;
              }}
              size="small"
            >
              Connexion avec Google
            </Button>

            <Typography
              sx={{ textAlign: "center", fontSize: "0.85rem", mt: 1 }}
            >
              Pas encore de compte ?{" "}
              <Link
                href="/sign-up"
                variant="body2"
                sx={{ fontSize: "0.85rem" }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Stack>
        </Card>
      </Box>
    </>
  );
}
