import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./api/auth.js";
import admin from "firebase-admin";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss"; // ✅ replace xss-clean
import hpp from "hpp";

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
// Security Middleware
// -----------------------------
app.use(helmet()); // Secure HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// ✅ Custom XSS Sanitizer (safe replacement for xss-clean)
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// ✅ Rate limiting (Anti-DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// -----------------------------
// CORS
// -----------------------------
app.use(
  cors({
    origin: isProduction
      ? "https://euonroia.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);

// Parse cookies and JSON
app.use(cookieParser());
app.use(express.json());

// -----------------------------
// Optional: Redirect direct browser access
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
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend is running securely!");
});

// -----------------------------
// Catch-all redirect (Express 5 fix)
// -----------------------------
app.use((req, res) => {
  res.redirect(FRONTEND_URL);
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Secure server running on port ${PORT}`);
});
