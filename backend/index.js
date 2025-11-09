import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { ENV } from "./config/env.js";
import "./config/firebase.js"; // initializes admin
import { securityMiddleware } from "./config/security.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// -----------------------------
// Middleware
// -----------------------------
app.set("trust proxy", 1);
app.use(securityMiddleware);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://euonroia.onrender.com",
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// -----------------------------
// API Routes
// -----------------------------
app.use("/auth", authRoutes);

// -----------------------------
// Serve React Frontend (frontend/dist)
// -----------------------------
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "frontend", "dist");

app.use(express.static(frontendPath));

// **SPA Fallback without using "*"**
app.use((req, res, next) => {
  // If the request is for an API route, skip this
  if (req.path.startsWith("/auth")) return next();
  // Otherwise, serve index.html
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// -----------------------------
// Server Start
// -----------------------------
app.listen(ENV.PORT, () => {
  console.log(`🚀 Secure server running on port ${ENV.PORT}`);
});
