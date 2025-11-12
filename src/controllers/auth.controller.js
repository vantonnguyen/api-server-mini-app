const AuthModel = require('../models/auth.model');

const AuthController = {
  async login(req, res) {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      return res.status(400).json({ success: false, message: 'Missing user_name or password.' });
    }
    try {
      const account = await AuthModel.login(user_name, password);
      if (!account) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
      // Lưu thông tin đăng nhập vào session
      req.session.admin = {
        id: account.id,
        user_name: account.user_name,
        role: account.role,
        email: account.email,
        phone_number: account.phone_number
      };
      // Trả về thông tin tài khoản (có thể loại bỏ password trước khi trả về)
      const { password: _, ...accountInfo } = account;
      res.json({ success: true, data: accountInfo });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = AuthController;
