const ZaloUserModel = require('../models/zaloUser.model');
const zaloUserService = require('../services/zaloUser.service');

const ZaloUserController = {
  async syncUser(req, res) {
    const { accessToken, phoneToken } = req.body;
    if (!accessToken || !phoneToken) {
      return res.status(400).json({ success: false, message: 'accessToken and phoneToken are required.' });
    }
    try {
      const user = await zaloUserService.getUserInfoAndSave(accessToken, phoneToken);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

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
      const user = await ZaloUserModel.findByZaloId(req.params.zaloId);
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
      const user = await ZaloUserModel.update(req.params.id, req.body);
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
