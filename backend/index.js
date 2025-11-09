import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import authRoutes from "./api/auth.js";

const app = express();

// -----------------------------
// Trust proxy (needed for secure cookies behind Render)
// -----------------------------
app.set("trust proxy", 1);

const FRONTEND_URL = ENV.VITE_FRONTEND_URL|| "https://euonroia.onrender.com";
const allowedOrigins = [
  "https://euonroia.onrender.com",
  "http://localhost:5173",
];

// -----------------------------
// Middleware
// -----------------------------
app.use(securityMiddleware);

// ✅ Dynamic CORS for allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl, mobile apps, etc
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error(`CORS not allowed for origin ${origin}`), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies
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
// Catch-all redirect
// -----------------------------
app.use((req, res) => res.redirect(FRONTEND_URL));

// -----------------------------
// Start server
// -----------------------------
const PORT = ENV.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Secure server running on port ${PORT}`));
