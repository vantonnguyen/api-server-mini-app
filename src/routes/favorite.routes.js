const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');

// Lấy danh sách favorite của user hiện tại (xác thực bằng accessToken)
router.get('/me', FavoriteController.getMyFavorites);

// Thêm vào favorite
router.post('/', FavoriteController.addFavorite);

// Xóa khỏi favorite
router.delete('/', FavoriteController.removeFavorite);

// Route cũ, có thể giữ lại cho mục đích quản trị nội bộ nếu cần
router.get('/:user_id', FavoriteController.getUserFavorites);

module.exports = router;
