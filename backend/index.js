import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./api/auth.js";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";
const API_SECRET_KEY = process.env.API_SECRET_KEY || "supersecretkey";

// -----------------------------
// Initialize Firebase Admin
// -----------------------------
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT_JSON:", err);
    process.exit(1);
  }
} else {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ Firebase service account key not found:", serviceAccountPath);
    process.exit(1);
  }

  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// -----------------------------
// Middleware
// -----------------------------
app.use(
  cors({
    origin: isProduction
      ? "https://euonroia.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// -----------------------------
// Protect API routes with API key
// -----------------------------
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
  if (
    req.path.startsWith("/auth") || 
    req.path.startsWith("/api")
  ) {
    if (!key || key !== API_SECRET_KEY) {
      return res.status(403).json({ error: "Forbidden: Invalid API key" });
    }
  }
  next();
});

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);

// -----------------------------
// Redirect browser visitors to frontend
// -----------------------------
app.get("/", (req, res) => {
  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("axios") && !ua.toLowerCase().includes("fetch")) {
    return res.redirect(FRONTEND_URL);
  }
  res.json({ message: "Backend API is running" });
});

// Optional: catch-all to redirect unknown paths
app.get("*", (req, res, next) => {
  if (!req.path.startsWith("/auth") && !req.path.startsWith("/api")) {
    return res.redirect(FRONTEND_URL);
  }
  next();
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
