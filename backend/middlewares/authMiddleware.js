const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header: "Bearer <token>"
  if (!token) {     // Block request if token is missing
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode its payload
    req.user = decoded;  // Attach user info to request object for downstream use
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." }); // Token is invalid, expired, or tampered with
  }
};

module.exports = authMiddleware;
