const AuthModel = require("../models/auth.model");

const AuthController = {
  async login(req, res) {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user_name or password." });
    }
    try {
      const account = await AuthModel.login(user_name, password);
      if (!account) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password." });
      }
      req.session.admin = {
        id: account.id,
        user_name: account.user_name,
        role: account.role,
        email: account.email,
        phone_number: account.phone_number,
      };

      const { password: _, ...accountInfo } = account;
      res.json({ success: true, data: accountInfo });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  validateSession(req, res) {
    console.log("Session data:", req.session); // Log session data for debugging
    if (!req.session.admin || req.session.admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admin only." });
    }
    console.log("Session is valid for admin user.", req.session.admin);
     res.json({ success: true, data: req.session.admin });
  },

  logout(req, res) {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Logout failed." });
        } else {
          return res.json({
            success: true,
            message: "Logged out successfully.",
          });
        }
      });
    } else {
      res.json({ success: true, message: "No active session." });
    }
  },
};

module.exports = AuthController;
