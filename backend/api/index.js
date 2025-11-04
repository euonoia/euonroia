import { Router } from "express";
import authRoutes from "./auth.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.send("✅ Euonroia Secure Backend API is alive!");
});

export default router;
