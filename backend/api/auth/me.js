import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  const clientCsrfToken = req.headers["x-csrf-token"];
  const cookieCsrfToken = req.cookies?.euonroiaCsrfToken;

  if (!clientCsrfToken || clientCsrfToken !== cookieCsrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  res.json({ user: req.user });
});

export default router;
