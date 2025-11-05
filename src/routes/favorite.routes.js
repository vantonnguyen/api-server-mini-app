const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');

// Lấy danh sách favorite của user
router.get('/:user_id', FavoriteController.getUserFavorites);

// Thêm vào favorite
router.post('/', FavoriteController.addFavorite);

// Xóa khỏi favorite
router.delete('/', FavoriteController.removeFavorite);

module.exports = router;
