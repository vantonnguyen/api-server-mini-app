const { pool } = require('../config/db');

const ZaloUserModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM zalo_user ORDER BY id ASC');
    return res.rows;
  },

  async findByZaloId(zaloId) {
    const res = await pool.query('SELECT * FROM zalo_user WHERE zalo_id = $1', [zaloId]);
    return res.rows[0];
  },

  async create({ zalo_id, name, phone_number, avatar_url }) {
    const res = await pool.query(
      `INSERT INTO zalo_user (zalo_id, name, phone_number, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [zalo_id, name, phone_number, avatar_url]
    );
    return res.rows[0];
  },

  async update(id, { name, phone_number, avatar_url }) {
    const res = await pool.query(
      `UPDATE zalo_user
       SET name=$1, phone_number=$2, avatar_url=$3
       WHERE id=$4 RETURNING *`,
      [name, phone_number, avatar_url, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM zalo_user WHERE id=$1', [id]);
    return true;
  },
};

module.exports = ZaloUserModel;
