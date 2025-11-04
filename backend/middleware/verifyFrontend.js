export function verifyFrontend(req, res, next) {
  const apiKey = req.headers["x-frontend-key"];
  if (!apiKey || apiKey !== process.env.VITE_FRONTEND_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
}
