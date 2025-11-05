import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import xssSanitizer from "../middlewares/xssSanitizer.js";

export const securityMiddleware = [
  helmet(),
  hpp(),
  xssSanitizer,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  }),
];
