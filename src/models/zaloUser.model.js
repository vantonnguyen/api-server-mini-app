const { pool } = require('../config/db');

const ZaloUserModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM zalo_user ORDER BY id ASC');
    return res.rows;
  },

  async getByZaloId(zaloId) {
    const res = await pool.query('SELECT * FROM zalo_user WHERE zalo_id = $1', [zaloId]);
    return res.rows[0];
  },

  async create({ zalo_id, name, phone_number, location, avatar_url }) {
    const res = await pool.query(
      `INSERT INTO zalo_user (zalo_id, name, phone_number, location, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [zalo_id, name, phone_number, location, avatar_url]
    );
    return res.rows[0];
  },

  async update(zalo_id, { name, phone_number, location, avatar_url }) {
    const res = await pool.query(
      `UPDATE zalo_user
       SET name=$1, phone_number=$2, location=$3, avatar_url=$4
       WHERE zalo_id=$5 RETURNING *`,
      [name, phone_number, location, avatar_url, zalo_id]
    );
    return res.rows[0];
  },

  async delete(zalo_id) {
    await pool.query('DELETE FROM zalo_user WHERE zalo_id=$1', [zalo_id]);
    return true;
  },
};

module.exports = ZaloUserModel;
