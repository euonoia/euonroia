import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import authRoutes from "./api/auth.js";

const app = express();

// Trust proxy for secure cookies behind Render
app.set("trust proxy", 1);

const isProduction = ENV.NODE_ENV === "production";
const FRONTEND_URL = ENV.FRONTEND_URL || "https://euonroia.onrender.com";

const allowedOrigins = [
  "https://euonroia.onrender.com",
  "http://localhost:5173",
];

// -----------------------------
// Middleware
// -----------------------------
app.use(securityMiddleware);

// ✅ Dynamic CORS to fix "No 'Access-Control-Allow-Origin'" error
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like curl or mobile apps
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from ${origin}`;
        return callback(new Error(msg), false);
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
// Catch-all Redirect
// -----------------------------
app.use((req, res) => res.redirect(FRONTEND_URL));

// -----------------------------
// Start Server
// -----------------------------
const PORT = ENV.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure server running on port ${PORT}`);
});
