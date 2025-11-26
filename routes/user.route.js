const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const protect = require('../middlewares/auth');

// Đăng ký
router.post('/register', userCtrl.register);

// Đâng nhập
router.post('/login', userCtrl.login);

// Lấy thông tin người dùng hiện tại
router.get('/me', protect, userCtrl.getProfile);

// Cập nhật thông tin người dùng
router.put('/update', protect, userCtrl.updateUser);

// Thêm địa chỉ
router.post('/address', protect, userCtrl.addAddress);

// Xoá địa chỉ
router.delete('/address/:addressId', protect, userCtrl.removeAddress);

module.exports = router;