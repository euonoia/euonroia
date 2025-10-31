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

// Load service account
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  console.error("❌ Missing or invalid FIREBASE_SERVICE_ACCOUNT_PATH");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

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
