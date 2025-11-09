import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ENV } from "./config/env.js";
import "./config/firebase.js"; // initializes admin
import { securityMiddleware } from "./config/security.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// -----------------------------
// Middleware
// -----------------------------
app.set("trust proxy", 1);
app.use(securityMiddleware);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://euonroia.onrender.com",
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// -----------------------------
// API Routes
// -----------------------------
app.use("/auth", authRoutes);

// -----------------------------
// Unknown route handler (backend only)
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// -----------------------------
// Server Start
// -----------------------------
app.listen(ENV.PORT, () => {
  console.log(`🚀 Secure server running on port ${ENV.PORT}`);
});