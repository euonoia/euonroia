import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import authRoutes from "./api/auth.js";
import firestoreRoutes from "./api/firestore.js";
import cookieParser from "cookie-parser";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// Firebase Admin
// -----------------------------
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
  serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
} else {
  console.error("❌ Missing Firebase credentials.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase initialized");

// -----------------------------
// Middleware
// -----------------------------
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL, // e.g., https://euonroia.onrender.com
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);
app.use("/api", firestoreRoutes(admin.firestore()));

// -----------------------------
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
