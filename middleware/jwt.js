import jwt from "jsonwebtoken";

// Middleware to verify the JWT token
export const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not found" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    return res.status(401).json({ error: "Invalid or Expired Token" });
  }
};

export const generateToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  // Access token valid for 1 hour (adjust as needed)
  return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
};
