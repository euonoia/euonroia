// backend/index.js
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import admin from "firebase-admin";
import cors from "cors";
import cookieParser from "cookie-parser";
import firestoreRoutes from "./api/firestore.js";
import authRoutes from "./api/auth.js";
import apiRoutes from "./api/api.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true })); // enable cookies
app.use(express.json());
app.use(cookieParser());

// -------------------
// Firebase setup
// -------------------
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH &&
  fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
) {
  serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8")
  );
} else {
  console.error("❌ Missing Firebase credentials (JSON or path).");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("✅ Firestore connection OK");

// -------------------
// Routes
// -------------------

// Auth routes (Google OAuth & token verification)
app.use("/auth", authRoutes);       // popup login route
app.use("/api/auth", authRoutes);   // API token verification route

// Firestore CRUD routes
app.use("/api", firestoreRoutes(db)); // ⚡ pass db instance

// Protected API routes
app.use("/api", apiRoutes);

// -------------------
// Start server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
