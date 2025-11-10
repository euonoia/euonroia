import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";
const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
  : "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET;

app.set("trust proxy", 1);
app.use(securityMiddleware);

// CORS for cross-origin cookies
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// --- Smart redirect on backend root ---
app.get("/", (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      // Guest → go to landing page
      return res.redirect(FRONTEND_URL);
    }
    // Try to verify JWT
    jwt.verify(token, JWT_SECRET);
    // Logged-in → go to dashboard
    return res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch {
    // Invalid or missing token → landing page
    return res.redirect(FRONTEND_URL);
  }
});

app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend running on port ${ENV.PORT}`);
});
