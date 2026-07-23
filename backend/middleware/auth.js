const jwt = require('jsonwebtoken');

// Verify JWT Token for logged-in users
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_unified_mentor_2026');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// Verify if user is an Admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };