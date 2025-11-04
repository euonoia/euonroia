import cors from "cors";

const isProduction = process.env.NODE_ENV === "production";

export const corsConfig = cors({
  origin: isProduction
    ? "https://euonroia.onrender.com"
    : "http://localhost:5173",
  credentials: true,
});
