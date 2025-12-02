const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/products');
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const filter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowed.includes(file.mimetype)) {
        cb(new Error('Ảnh sai định dạng'), false);
    } else {
        cb(null, true);
    }
};

const uploadProduct = multer({
    storage,
    fileFilter: filter
});

module.exports = uploadProduct;