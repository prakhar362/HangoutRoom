const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ error: "Token not found" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    if (!decoded.id) {
      console.error('No user ID in token payload');
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: decoded.id }; // Only attach the user ID
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;