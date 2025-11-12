const { pool } = require("../config/db");

const AuthModel = {
  // Tìm tài khoản theo tên đăng nhập
  async findByUserName(user_name) {
    const res = await pool.query(
      "SELECT * FROM account WHERE user_name = $1",
      [user_name]
    );
    return res.rows[0];
  },

  // Kiểm tra mật khẩu (so sánh hash)
  async validatePassword(plainPassword, hashedPassword) {
    return plainPassword === hashedPassword;
  },

  // Đăng nhập: trả về thông tin tài khoản nếu đúng, null nếu sai
  async login(user_name, plainPassword) {
    const account = await this.findByUserName(user_name);
    if (!account) return null;
    const isValid = await this.validatePassword(plainPassword, account.password);
    if (!isValid) return null;
    return account;
  }
};

module.exports = AuthModel;
