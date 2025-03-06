const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phone: {
        type: Number,
    },
    pid: {
        type: Number,
    },
    new: {
        type: Boolean,
        default: true,
    },
    otp: {
        type: Number,
        default: null
    },
});

module.exports = mongoose.model('User',User);