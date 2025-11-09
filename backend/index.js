import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
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
  origin: ENV.FRONTEND_URL, // only frontend domain
  credentials: true,         // send cookies cross-origin
}));

app.use(cookieParser());
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("✅ Backend running securely"));

// -----------------------------
// Catch-all (optional)
// -----------------------------
app.use((req, res) => res.status(404).send("Not found"));

// -----------------------------
// Start server
// -----------------------------
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend running on port ${ENV.PORT}`);
});
