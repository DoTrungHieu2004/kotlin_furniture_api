const bcrypt = require('bcryptjs');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            phone,
            addresses: []   // danh sách địa chỉ trống ban đầu
        });

        return res.json({
            message: 'Đăng ký thành công',
            user: { ...user._doc, password: undefined },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

         return res.json({
            message: 'Đăng nhập thành công',
            user: { ...user._doc, password: undefined },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    res.json(req.user);
};

const updateUser = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({ message: 'Cập nhật thành công', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Không có quyền truy cập' });
        }

        const { label, address, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        if (!address || !label) {
            return res.status(401).json({ message: 'Tên địa chỉ (label) và địa chỉ là bắt buộc' });
        }

        const defaultFlag = (typeof isDefault === 'string') ? (isDefault === 'true') : !!isDefault;

        if (defaultFlag) {
            user.addresses.forEach(a => { a.isDefault = false; })
        }

        user.addresses.push({
            label,
            address,
            isDefault: defaultFlag
        });

        await user.save();

        res.status(201).json({
            message: 'Thêm địa chỉ thành công',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user._id);

        user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);

        await user.save();

        res.json({
            message: 'Đã xóa địa chỉ',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateUser,
    addAddress,
    removeAddress
};