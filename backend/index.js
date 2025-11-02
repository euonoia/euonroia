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

// -----------------------------
// Initialize Firebase Admin
// -----------------------------
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // Use JSON from environment variable (deployed)
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT_JSON:", err);
    process.exit(1);
  }
} else {
  // Use local serviceAccountKey.json
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
      ? "https://euonroia.onrender.com" // your deployed frontend
      : "http://localhost:5173",
    credentials: true, // ✅ allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
