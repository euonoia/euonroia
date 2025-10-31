import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import admin from "firebase-admin";
import cors from "cors";
import firestoreRoutes from "./api/firestore.js";
import authRoutes from "./api/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
 
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
  
  serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
} else {
  console.error("❌ Missing Firebase credentials (JSON or file path).");
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("✅ Firestore connection OK");

// Use routes
app.use("/api", firestoreRoutes(db));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
