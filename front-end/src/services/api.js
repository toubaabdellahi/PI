// src/services/api.js
import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  withCredentials: true,
});


// export des loginUser et signUpUser avec fetch ici...

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


// ✅ Importer axios
///import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/profil/';

// ✅ 1. Créer une instance Axios
const APIP = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ 2. Ajouter le token JWT automatiquement
APIP.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 3. Fonctions utilisant l'instance APIP
export const enregistrerReponsesProfiling = async (userId, answers) => {
  try {
    const payload = {
      user_id: userId,
      ...answers,
    };
    const response = await APIP.post('enregistrer_reponses/', payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const recupererReponsesProfiling = async (userId) => {
  try {
    const response = await APIP.get(`recuperer_reponses/${userId}/`);
    return response.data.reponses;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
