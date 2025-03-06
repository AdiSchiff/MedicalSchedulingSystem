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
});

const user = mongoose.model('User',User);
module.exports = { user };