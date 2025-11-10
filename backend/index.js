import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import { protectBackend } from "./middlewares/protectBackend.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// ✅ Allow production frontend + localhost for development
const FRONTEND_URLS = isProduction
  ? ["https://euonroia.onrender.com"]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// Trust proxies (for secure cookies behind load balancers)
app.set("trust proxy", 1);

// Security middleware (helmet, rate limiting, etc.)
app.use(securityMiddleware);

// ✅ CORS for frontend(s) only, with cookies
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Protect backend routes
app.use(protectBackend);

// Auth routes
app.use("/auth", authRoutes);

// Redirect browser requests for non-API/auth paths
app.use(redirectBrowser);

// Default route
app.get("/", (req, res) => res.send("✅ Backend running securely"));

// Start server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend running on port ${ENV.PORT}`);
});
