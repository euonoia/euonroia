import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import "./config/firebase.js";
import { securityMiddleware } from "./config/security.js";
import redirectBrowser from "./middlewares/redirectBrowser.js";
import { protectBackend } from "./middlewares/protectBackend.js";
import authRoutes from "./api/auth.js";
import lessonsRoutes from "./api/lessons/html-basics.js";
import dashboardRoutes from "./api/dashboard.js";
import cssLessonsRouter from "./api/lessons/cssBasics.js";
import javascriptLessonsRouter from "./api/lessons/javascript.js";

const app = express();
const isProduction = ENV.NODE_ENV === "production";

// ✅ Allowed frontends
const FRONTEND_URLS = isProduction
  ? ["https://euonroia.onrender.com"]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// Trust proxies for secure cookies
app.set("trust proxy", 1);

// Security middleware (helmet, rate limiting, etc.)
app.use(securityMiddleware);

// ✅ CORS: allow frontend origins only, with cookies
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// 1️⃣ Auth routes first (Google OAuth login & callback)
app.use("/auth", authRoutes);

// 2️⃣ Protect sensitive backend routes (API + /auth/me + /auth/signout)
app.use(protectBackend);

// 3️⃣ Redirect browser requests for non-API/auth paths
app.use(redirectBrowser);


app.use("/api/lessons", lessonsRoutes);
app.use("/api/lessons", cssLessonsRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/lessons", javascriptLessonsRouter);

// 4️⃣ Root route
app.get("/", (req, res) => res.send("✅ Backend running securely"));


// Start server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Backend running on port ${ENV.PORT}`);
});
