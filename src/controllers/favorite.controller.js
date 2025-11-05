const FavoriteModel = require('../models/favoriteVocabulary.model');

const FavoriteController = {
  async getUserFavorites(req, res) {
    try {
      const favorites = await FavoriteModel.getUserFavorites(req.params.user_id);
      res.json({ success: true, data: favorites });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async addFavorite(req, res) {
    try {
      const favorite = await FavoriteModel.addFavorite(req.body.user_id, req.body.vocabulary_id);
      res.status(201).json({ success: true, data: favorite });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async removeFavorite(req, res) {
    try {
      await FavoriteModel.removeFavorite(req.body.user_id, req.body.vocabulary_id);
      res.json({ success: true, message: 'Removed from favorites' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = FavoriteController;
