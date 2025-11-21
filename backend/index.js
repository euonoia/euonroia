import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import { protectBackend } from "./middlewares/protectBackend.js";

import authRoutes from "./api/auth/index.js";
import lessonsRoutes from "./api/lessons/html-basics.js";
import dashboardRoutes from "./api/milestones.js";
import cssLessonsRouter from "./api/lessons/cssBasics.js";
import javascriptLessonsRouter from "./api/lessons/javascript.js";
import leaderboardRoutes from "./api/leaderboard/leaderboard.js";
import checkBadge from "./api/badges/check.js";
import earnedBadges from "./api/badges/earnedbadges.js";
import preloadSnippets from "./api/trainer/preloadSnippets.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed frontend origins
const FRONTEND_URLS = isProduction
  ? ["https://euonroia.onrender.com"]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// Trust proxies (required for Secure cookies on Render)
app.set("trust proxy", 1);

// Security middleware
app.use(securityMiddleware);

// CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/* --------------------------------------------------
   1️⃣ AUTH ROUTES (Google OAuth)
   -------------------------------------------------- */
app.use("/auth", authRoutes);

/* --------------------------------------------------
   2️⃣ PROTECTED API ROUTES
   -------------------------------------------------- */
app.use(protectBackend);

app.use("/api/lessons", lessonsRoutes);
app.use("/api/lessons", cssLessonsRouter);
app.use("/api/lessons", javascriptLessonsRouter);

app.use("/api/milestones", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", checkBadge);
app.use("/api/badgesEarned", earnedBadges);

app.use("/api/admin", preloadSnippets);

/* --------------------------------------------------
   3️⃣ SERVE FRONTEND BUILD (Vite dist/)
   -------------------------------------------------- */
app.use(express.static(path.join(__dirname, "public")));

/* --------------------------------------------------
   4️⃣ REACT ROUTER FALLBACK
       Excludes /api and /auth from React Router
   -------------------------------------------------- */
app.get(/^\/(?!api|auth).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* --------------------------------------------------
   5️⃣ START SERVER
   -------------------------------------------------- */
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${ENV.PORT}`);
});
