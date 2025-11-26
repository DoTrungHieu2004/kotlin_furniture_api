const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    addresses: [{
        label: String,
        address: String,
        isDefault: String
    }],
    avatar: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106"
    },
    role: {
        type: String,
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);