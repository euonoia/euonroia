import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import authRoutes from "./api/auth.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";
// Trust proxy so secure cookies work behind Render/Proxies
app.set("trust proxy", 1);

// -----------------------------
// Middleware
// -----------------------------
app.use(securityMiddleware);


app.use(cors({
  origin: [
    "https://euonroia.onrender.com",
    "http://localhost:5173",
  ],
  credentials: true,
}));

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
app.listen(ENV.PORT, () => {
  console.log(`🚀 Secure server running on port ${ENV.PORT}`);
});
