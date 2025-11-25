import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // include HTTP-only cookies
});

// Attach CSRF token to unsafe requests automatically
axiosClient.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("euonroiaCsrfToken");

  // Only attach for unsafe methods
  const method = config.method?.toLowerCase() || "";
  if (csrfToken && !["get", "head", "options"].includes(method)) {
    // Ensure headers exist and are AxiosHeaders
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    (config.headers as AxiosHeaders).set("x-csrf-token", csrfToken);
  }

  return config;
});

export default axiosClient;
