import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Injecte automatiquement le token JWT stocké au login sur chaque requête.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si le token est expiré/invalide, on nettoie et on renvoie vers le login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);