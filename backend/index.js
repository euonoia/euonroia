// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { ENV } from "./config/env.js";
import "./config/firebase.js"; // Firebase admin
import { securityMiddleware } from "./config/security.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// -----------------------------
// Middleware
// -----------------------------
app.set("trust proxy", 1); // for Render HTTPS
app.use(securityMiddleware);

app.use(
  cors({
    origin: ["https://euonroia.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);
app.get("/", (req, res) => res.send("✅ Backend is running securely!"));

// -----------------------------
// Serve frontend (optional if using same service)
// -----------------------------
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// -----------------------------
// SPA Fallback
// -----------------------------
app.get(/.*/, (req, res) => {
  // Only serve SPA if request is not for API
  if (req.path.startsWith("/auth")) return res.status(404).send("API endpoint not found");
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -----------------------------
// Server Start
// -----------------------------
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend running on port ${ENV.PORT}`);
});
