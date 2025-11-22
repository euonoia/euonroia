import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import lusca from "lusca";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import { protectBackend } from "./middlewares/protectBackend.js";

import authRoutes from "./api/auth/index.js";
import lessonsRoutes from "./api/lessons/index.js";
import dashboardRoutes from "./api/dashboard/index.js";
import leaderboardRoutes from "./api/leaderboard/leaderboard.js";
import Badges from "./api/badges/index.js";
import preloadSnippets from "./api/trainer/preloadSnippets.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_URLS = isProduction
  ? ["https://euonroia.onrender.com"]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.set("trust proxy", 1);

app.use(securityMiddleware);

// CORS
app.use(
  cors({
    origin: FRONTEND_URLS,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/* ---------------- AUTH ---------------- */
app.use("/auth", authRoutes);

/* ---------------- PROTECTED API ---------------- */
app.use(protectBackend);

app.use("/api/lessons", lessonsRoutes);
app.use("/api/milestones", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", Badges);
app.use("/api/admin", preloadSnippets);

/* ---------------- STATIC FILES ---------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- CSRF FOR FRONTEND ONLY ---------------- */
// Lusca must come **after** routes but **before SPA fallback**
app.use(lusca.csrf());

/* ---------------- REACT ROUTER FALLBACK ---------------- */
app.get(/^\/(?!api|auth).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------------- START SERVER ---------------- */
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${ENV.PORT}`);
});
