const ProgressModel = require('../models/learningProgress.model');

const ProgressController = {
  async getUserProgress(req, res) {
    try {
      const progress = await ProgressModel.getUserProgress(req.params.user_id);
      res.json({ success: true, data: progress });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async markLearned(req, res) {
    try {
      const updated = await ProgressModel.markLearned(
        req.body.user_id, req.body.vocabulary_id, req.body.is_learned
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async markMastered(req, res) {
    try {
      const updated = await ProgressModel.markMastered(
        req.body.user_id, req.body.vocabulary_id, req.body.mastered
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = ProgressController;
