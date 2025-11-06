const { pool } = require("../config/db");

const CategoryModel = {
  async getAll() {
    const res = await pool.query("SELECT * FROM category ORDER BY id ASC");
    return res.rows;
  },

  async getByKey(key) {
    const res = await pool.query("SELECT * FROM category WHERE key = $1", [
      key,
    ]);
    return res.rows[0];
  },

  async create({ key, label, color, japanese, kana, romaji }) {
    const res = await pool.query(
      `INSERT INTO category (key, label, color, japanese, kana, romaji)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [key, label, color, japanese, kana, romaji]
    );
    return res.rows[0];
  },

  async update(key, { label, color, japanese, kana, romaji }) {
    const res = await pool.query(
      `UPDATE category
       SET label=$1, color=$2, japanese=$3, kana=$4, romaji=$5
       WHERE key=$6 RETURNING *`,
      [label, color, japanese, kana, romaji, key]
    );
    return res.rows[0];
  },

  async delete(key) {
    await pool.query("DELETE FROM category WHERE key=$1", [key]);
    return true;
  },
};

module.exports = CategoryModel;
