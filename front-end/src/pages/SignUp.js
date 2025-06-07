import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const GOOGLE_CLIENT_ID =
    "76497721292-2fmahu68t6r2vaiupdmq6rbbtqsm3jq5.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:8000/api/auth/login/google/callback/";

  const googleLoginUrl =
    `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=email%20profile`;
  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");
    const username = document.getElementById("username");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Full name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!username.value || username.value.length < 3) {
      setUsernameError(true);
      setUsernameErrorMessage("Username must be at least 3 characters.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      fullname: data.get("name"),
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Erreur lors de l'inscription.");
        return;
      }

      const result = await res.json();

      // Supposons que ton backend renvoie un token JWT dans result.token
      const token = result.token;
      if (token) {
        // Stockage du token JWT côté client (ici localStorage)
        localStorage.setItem("token", token);

        // Optionnel : tu peux aussi stocker les infos utilisateur
        localStorage.setItem("user", JSON.stringify(result.user));

        // Redirection après inscription
        navigate("/home");
      } else {
        alert("Inscription réussie mais pas de token reçu.");
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
          overflow: "hidden",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 2,
            boxShadow: 3,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Stack spacing={1}>
            <Typography component="h1" variant="h5" textAlign="center" mb={1}>
              Sign up
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={1}>
                <FormControl>
                  <FormLabel htmlFor="name" sx={{ fontSize: "0.9rem" }}>
                    Full Name
                  </FormLabel>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Full Name"
                    error={nameError}
                    helperText={nameErrorMessage}
                    size="small"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="username" sx={{ fontSize: "0.9rem" }}>
                    Username
                  </FormLabel>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    placeholder="Username"
                    error={usernameError}
                    helperText={usernameErrorMessage}
                    size="small"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="email" sx={{ fontSize: "0.9rem" }}>
                    Email
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    placeholder="Your email"
                    name="email"
                    autoComplete="email"
                    error={emailError}
                    helperText={emailErrorMessage}
                    size="small"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password" sx={{ fontSize: "0.9rem" }}>
                    Password
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    size="small"
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="medium"
                  sx={{ mt: 1 }}
                >
                  Sign up
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                or
              </Typography>
            </Divider>

            <Stack spacing={0.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => {
                  window.location.href = googleLoginUrl;
                }}
                size="small"
              >
                Sign up with Google
              </Button>
            </Stack>

            <Typography
              sx={{ textAlign: "center", fontSize: "0.85rem", mt: 1 }}
            >
              Already have an account?{" "}
              <Link href="/login" variant="body2" sx={{ fontSize: "0.85rem" }}>
                Sign in
              </Link>
            </Typography>
          </Stack>
        </Card>
      </Box>
    </>
  );
}
