import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
