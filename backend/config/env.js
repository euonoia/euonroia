import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback",
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceaccountKey.json",
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || null,
};
