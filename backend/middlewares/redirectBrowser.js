import { ENV } from "../config/env.js";

export default function redirectBrowser(req, res, next) {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const isBrowser = !ua.includes("axios") && !ua.includes("fetch");

  if (isBrowser && !req.path.startsWith("/auth") && !req.path.startsWith("/api")) {
    return res.redirect(ENV.FRONTEND_URL);
  }
  next();
}
