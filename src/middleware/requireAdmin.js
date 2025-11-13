// src/middleware/requireAdmin.js
module.exports = function requireAdmin(req, res, next) {
  if (!req.session.admin || req.session.admin.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin only.' });
  }
  next();
};
