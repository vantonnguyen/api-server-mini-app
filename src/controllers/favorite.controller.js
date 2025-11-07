const FavoriteModel = require('../models/favoriteVocabulary.model');
const zaloUserService = require('../services/zaloUser.service');

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
    const { vocabulary_id, accessToken, phoneToken } = req.body; // phoneToken is now optional

    if (!vocabulary_id || !accessToken) {
      return res.status(400).json({ success: false, message: 'vocabulary_id and accessToken are required.' });
    }

    try {
      // Step 1: Get user info and check if phone permission is needed
      const { user, needsPhonePermission } = await zaloUserService.getUserInfoAndSave(accessToken, phoneToken);

      // If phone permission is needed and not provided in this call, ask the client to get it.
      if (needsPhonePermission) {
        return res.status(200).json({ success: false, needsPhonePermission: true, message: 'User phone number is required.' });
      }
      
      if (!user || !user.id) {
        return res.status(500).json({ success: false, message: 'Failed to get or create user.' });
      }

      // Step 2: Add the vocabulary to favorites for that user
      const favorite = await FavoriteModel.addFavorite(user.id, vocabulary_id);
      res.status(201).json({ success: true, data: favorite, needsPhonePermission: false });
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
