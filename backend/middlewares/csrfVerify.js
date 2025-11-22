// middlewares/csrfVerify.js
export const verifyCsrfToken = (req, res, next) => {
  const cookieToken = req.cookies?.euonroiaCsrfToken;
  const headerToken = req.headers["x-csrf-token"];

  // Allow safe requests without check
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      success: false,
      message: "Missing CSRF token",
    });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }

  next();
};
