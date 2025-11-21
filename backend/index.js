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
import lessonsRoutes from "./api/lessons/index.js";
import dashboardRoutes from "./api/dashboard/index.js";
import leaderboardRoutes from "./api/leaderboard/leaderboard.js";

import Badges from "./api/badges/index.js";

import preloadSnippets from "./api/trainer/preloadSnippets.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed frontend origins
const FRONTEND_URLS = isProduction
  ? [
      "https://euonroia.onrender.com",                 // main site
      /^https:\/\/euonroia-pr-\d+\.onrender\.com$/    // PR preview URLs
    ]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];


// Trust proxies (required for Secure cookies on Render)
app.set("trust proxy", 1);

// Security middleware
app.use(securityMiddleware);

// CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      const allowed = FRONTEND_URLS.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );
      if (allowed) return callback(null, true);
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
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
app.use("/api/milestones", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", Badges);
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
