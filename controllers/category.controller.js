const slugify = require('slugify');

const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Tên danh mục không được bỏ trống' });
        }

        const slug = slugify(name, { lower: true });

        const exist = await Category.findOne({ slug });
        if (exist) {
            return res.status(400).json({ message: 'Danh mục này đã tồn tại' });
        }

        const category = await Category.create({ name, slug });

        res.status(201).json({
            message: 'Tạo danh mục thành công',
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true });
        }

        await category.save();

        res.json({
            message: 'Danh mục đã được cập nhật',
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }

        res.json({ message: 'Xóa thành công danh mục '});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};