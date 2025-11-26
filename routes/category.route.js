const express = require('express');
const router = express.Router();

const categoryCtrl = require('../controllers/category.controller');
const protect = require('../middlewares/auth');

// Public (tùy yêu cầu)
router.get('/', categoryCtrl.getCategories);
router.get('/:id', categoryCtrl.getCategory);

// Admin routes
router.post('/', protect, categoryCtrl.createCategory);
router.put('/:id', protect, categoryCtrl.updateCategory);
router.delete('/:id', protect, categoryCtrl.deleteCategory);

module.exports = router;