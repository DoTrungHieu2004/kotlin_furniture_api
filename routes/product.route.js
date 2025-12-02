const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product.controller');
const uploadProduct = require('../middlewares/uploadProduct');
const protect = require('../middlewares/auth');

router.get('/', productCtrl.getProducts);
router.get('/:id', productCtrl.getProductById);
router.get('/category/:categoryId', productCtrl.getProductsByCategory);

// Admin routes
router.post('/', protect, uploadProduct.single('image'), productCtrl.createProduct);
router.put('/:id', protect, uploadProduct.single('image'), productCtrl.updateProduct);
router.delete('/:id', protect, productCtrl.deleteProduct);

module.exports = router;