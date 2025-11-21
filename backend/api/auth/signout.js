import { Router } from "express";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";

router.post("/", (req, res) => {
  res.clearCookie("euonroiaAuthToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  res.clearCookie("euonroiaCsrfToken", {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  res.json({ success: true });
});

export default router;
