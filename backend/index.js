import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js"; // initializes admin
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// -----------------------------
// Middleware
// -----------------------------
app.use(securityMiddleware);

app.use(
  cors({
    origin: isProduction ? "https://euonroia.onrender.com" : ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(redirectBrowser);

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);
app.get("/", (req, res) => res.send("✅ Backend is running securely!"));

// -----------------------------
// Catch-all Redirect
// -----------------------------
app.use((req, res) => res.redirect(ENV.FRONTEND_URL));

// -----------------------------
// Server Start
// -----------------------------
app.listen(ENV.PORT, () =>
  console.log(`🚀 Secure server running on port ${ENV.PORT}`)
);
