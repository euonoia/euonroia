import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

// Attach frontend key to every request
axiosClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_FRONTEND_API_KEY;
  config.headers["x-frontend-key"] = apiKey;

  const token = localStorage.getItem("authToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default axiosClient;
