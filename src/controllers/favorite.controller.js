const FavoriteModel = require("../models/favoriteVocabulary.model");
const zaloUserService = require("../services/zaloUser.service");
const ZaloUserModel = require("../models/zaloUser.model");
const axios = require("axios");

const ZALO_ME_ENDPOINT = "https://graph.zalo.me/v2.0/me";

const FavoriteController = {
  async getMyFavorites(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Unauthorized: Access token is missing or malformed.",
          });
      }
      const accessToken = authHeader.split(" ")[1];

      // 1. Dùng access token để lấy zalo_id
      const { data: basicInfoResponse } = await axios.get(ZALO_ME_ENDPOINT, {
        params: {
          access_token: accessToken,
          fields: "id",
        },
      });

      if (basicInfoResponse.error || !basicInfoResponse.id) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Invalid access token or insufficient permissions.",
          });
      }
      const zaloId = basicInfoResponse.id;

      // 2. Dùng zalo_id để lấy danh sách favorites
      const favorites = await FavoriteModel.getUserFavorites(zaloId);
      res.json({ success: true, data: favorites });
    } catch (err) {
      console.error("Error in getMyFavorites:", err.message);
      if (err.response) {
        console.error("Zalo API Response:", err.response.data);
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getUserFavorites(req, res) {
    try {
      const favorites = await FavoriteModel.getUserFavorites(
        req.params.user_id
      );
      res.json({ success: true, data: favorites });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async addFavorite(req, res) {
    const { vocabulary_id, accessToken, phoneToken } = req.body; // phoneToken is now optional

    if (!vocabulary_id || !accessToken) {
      return res
        .status(400)
        .json({
          success: false,
          message: "vocabulary_id and accessToken are required.",
        });
    }

    try {
      // Step 1: Get user info and check if phone permission is needed
      const { user, needsPhonePermission } =
        await zaloUserService.getUserInfoAndSave(accessToken, phoneToken);

      // If phone permission is needed and not provided in this call, ask the client to get it.
      if (needsPhonePermission) {
        return res.status(200).json({
          success: false,
          needsPhonePermission: true,
          data: {
            needsPhonePermission: true, // 🔹 Đảm bảo request.data luôn tồn tại
            message: "User phone number is required.",
          },
        });
      }

      if (!user || !user.id) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to get or create user." });
      }

      // Step 2: Add the vocabulary to favorites for that user
      const favorite = await FavoriteModel.addFavorite(
        user.zalo_id,
        vocabulary_id
      );
      res
        .status(201)
        .json({ success: true, data: favorite, needsPhonePermission: false });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async removeFavorite(req, res) {
    const { vocabulary_id, accessToken } = req.body;
    if (!vocabulary_id || !accessToken) {
      return res
        .status(400)
        .json({
          success: false,
          message: "vocabulary_id and accessToken are required.",
        });
    }

    try {
      // Use the same logic as getMyFavorites to identify the user
      const { data: basicInfoResponse } = await axios.get(ZALO_ME_ENDPOINT, {
        params: { access_token: accessToken, fields: "id" },
      });

      if (basicInfoResponse.error || !basicInfoResponse.id) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid access token." });
      }
      const zaloId = basicInfoResponse.id;

      await FavoriteModel.removeFavorite(zaloId, vocabulary_id);
      res.json({ success: true, message: "Removed from favorites" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = FavoriteController;
