import axios from "axios";
import { getToken } from "./jwt.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CORS headers
  config.headers["Access-Control-Allow-Origin"] =
    "https://land-monitoring-web.vercel.app";

  return config;
});

export default api;
