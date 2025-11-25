import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;

// Deterministic CSRF token tied to JWT
export const generateCsrfToken = (jwtToken) => {
  return crypto
    .createHash("sha256")
    .update(jwtToken + "secret_salt") // fixed salt
    .digest("hex");
};

export const verifyCsrfToken = (req, res, next) => {
  const cookieToken = req.cookies?.euonroiaCsrfToken;
  const headerToken = req.headers["x-csrf-token"];
  const jwtToken = req.cookies?.euonroiaAuthToken;

  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  if (!cookieToken || !headerToken || !jwtToken) {
    return res.status(403).json({
      success: false,
      message: "Missing CSRF token or session",
    });
  }

  try {
    jwt.verify(jwtToken, JWT_SECRET);

    const expectedToken = generateCsrfToken(jwtToken);

    if (cookieToken !== headerToken || headerToken !== expectedToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid CSRF token",
      });
    }

    next();
  } catch (err) {
    console.error("CSRF verification error:", err);
    return res.status(403).json({
      success: false,
      message: "Invalid session or CSRF token",
    });
  }
};
