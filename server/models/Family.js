const mongoose = require('mongoose');
const User = require('./Users');

const Schema = mongoose.Schema;
const Family = new Schema({
    fid: {
        type: Number,
    },
    famids: {
        type: [User.pid],
    },
});

module.exports = mongoose.model('Family',Family);