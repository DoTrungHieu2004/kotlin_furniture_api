const Product = require('../models/Product');
const Category = require('../models/Category');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, discount, categoryId, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Bắt buộc phải có ảnh sản phẩm' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Không tìm thấy danh mục' });
        }

        if (!description || description.length < 10) {
            return res.status(400).json({
                message: 'Phải có mô tả sản phẩm và trên 10 ký tự'
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            discount: discount || 0,
            image: req.file.filename,
            categoryId,
            stock: stock || 0
        });

        res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const p = await Product.findById(req.params.id).populate('categoryId', 'name');

        if (!p) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        res.json(p);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ categoryId: req.params.categoryId })
            .populate('categoryId', 'name');
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const { name, description, price, discount, categoryId, stock } = req.body;

        if (name) product.name = name;
        if (description) {
            if (description.length < 10) {
                return res.status(400).json({
                    message: 'Phần mô tả sản phẩm phải từ 10 ký tự trở lên'
                });
            }
            product.description = description;
        }
        if (price) product.price = price;
        if (discount) product.discount = discount;
        if (categoryId) product.categoryId = categoryId;
        if (stock) product.stock = stock;

        // Thay ảnh sản phẩm nếu có ảnh mới
        if (req.file) product.image = req.file.filename;

        await product.save();

        res.json({
            message: 'Cập nhật sản phẩm thành công',
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id);
        if (!p) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductsByCategory,
    updateProduct,
    deleteProduct
};