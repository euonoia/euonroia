import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Add CSRF token to all state-changing requests
axiosClient.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("euonroiaCsrfToken");
  if (csrfToken && config.method !== "get") {
    config.headers!["x-csrf-token"] = csrfToken;
  }
  return config;
});

export default axiosClient;
