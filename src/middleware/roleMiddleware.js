module.exports = function (req, res, next) {
  // Check if req.user exists (set by authMiddleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  // Check if user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }

  next();
};
