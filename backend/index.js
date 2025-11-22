import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import { protectBackend } from "./middlewares/protectBackend.js";
import { verifyCsrfToken } from "./middlewares/csrfVerify.js";

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

// Trust Render proxy (needed for secure cookies)
app.set("trust proxy", 1);

// Global security middleware (Helmet, rate-limit, etc.)
app.use(securityMiddleware);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("❌ Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/* --------------------------------------------------
   1️⃣ AUTH ROUTES (Google OAuth)
   These MUST be allowed before CSRF check.
   -------------------------------------------------- */
app.use("/auth", authRoutes);

/* --------------------------------------------------
   2️⃣ CSRF PROTECTION
   All state-changing API routes will now require:
   - Valid CSRF cookie
   - Valid x-csrf-token header
   -------------------------------------------------- */
app.use(verifyCsrfToken);

/* --------------------------------------------------
   3️⃣ PROTECTED BACKEND ROUTES
   -------------------------------------------------- */
app.use(protectBackend);

app.use("/api/lessons", lessonsRoutes);
app.use("/api/milestones", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", Badges);
app.use("/api/admin", preloadSnippets);

/* --------------------------------------------------
   4️⃣ SERVE FRONTEND BUILD (Vite dist/)
   -------------------------------------------------- */
app.use(express.static(path.join(__dirname, "public")));

/* --------------------------------------------------
   5️⃣ REACT ROUTER FALLBACK
       Allows SPA routing except under /api and /auth
   -------------------------------------------------- */
app.get(/^\/(?!api|auth).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* --------------------------------------------------
   6️⃣ START SERVER
   -------------------------------------------------- */
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${ENV.PORT}`);
});
