// src/services/api.js
import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  withCredentials: true,
});

// export const loginUser = async (credentials) => {
//   const response = await API.post("/login/", credentials);
//   return response.data;
// };
export const loginUser = async (payload) => {
  const response = await fetch("http://localhost:8000/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};
export async function signUpUser(data) {
  try {
    const res = await fetch("http://localhost:8000/api/auth/register/", {
      method: "POST",
      credentials: "include", // pour envoyer les cookies (utile si tu configures des sessions côté backend)
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur lors de l'inscription.");
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Erreur réseau.");
  }
}
