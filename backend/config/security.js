import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import xssSanitizer from "../middlewares/xssSanitizer.js";

export const securityMiddleware = [
  // Helmet with modern-safe overrides
  helmet({
    contentSecurityPolicy: false,         
    crossOriginEmbedderPolicy: false,      
    crossOriginOpenerPolicy: false,        
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "sameorigin" }, 
  }),

  // Prevent HTTP parameter pollution
  hpp(),

  // Sanitize incoming user input
  xssSanitizer,

  // Rate limiting to protect backend from bot/DoS attacks
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000,               
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
  }),
];
