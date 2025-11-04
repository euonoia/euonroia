import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import { corsConfig } from "./config/corsConfig.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import { limiter } from "./middleware/rateLimiter.js";
import apiRouter from "./api/index.js";
import admin from "./config/firebase.js"; // ensures Firebase initializes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

// -----------------------------
// Middleware
// -----------------------------
app.use(helmet());
app.use(hpp());
app.use(limiter);
app.use(corsConfig);
app.use(cookieParser());
app.use(express.json());
app.use(sanitizeInput);

// -----------------------------
// Redirect browser access (optional)
// -----------------------------
app.use((req, res, next) => {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const isBrowser = !ua.includes("axios") && !ua.includes("fetch");
  if (isBrowser && !req.path.startsWith("/auth") && !req.path.startsWith("/api")) {
    return res.redirect(FRONTEND_URL);
  }
  next();
});

// -----------------------------
// Routes
// -----------------------------
app.use("/api", apiRouter);

// Catch-all fallback
app.use((req, res) => {
  res.redirect(FRONTEND_URL);
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Secure Euonroia backend running on port ${PORT}`);
});
