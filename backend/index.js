import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import admin from "firebase-admin";
import authRoutes from "./api/auth.js";
import firestoreRoutes from "./api/firestore.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;

app.use(express.json());
app.use(cookieParser());

// CORS for deployed frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // allow cookies
  })
);

// Load Firebase service account
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
  serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
} else {
  console.error("❌ Missing Firebase credentials.");
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("✅ Firestore connection OK");

// Routes
app.use("/api", firestoreRoutes(db));
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
