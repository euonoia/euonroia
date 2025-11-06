import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import xssSanitizer from "../middlewares/xssSanitizer.js";

export const securityMiddleware = [
  helmet(),
  hpp(),
  xssSanitizer,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,                // allow more requests during dev
    message: "Too many requests, please try again later.",
  }),
];
