const ZaloUserModel = require('../models/zaloUser.model');

const ZaloUserController = {
  async getAll(req, res) {
    try {
      const users = await ZaloUserModel.getAll();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getByZaloId(req, res) {
    try {
      const user = await ZaloUserModel.getByZaloId(req.params.zaloId);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const user = await ZaloUserModel.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const user = await ZaloUserModel.update(req.params.zaloId, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await ZaloUserModel.delete(req.params.zaloId);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = ZaloUserController;
