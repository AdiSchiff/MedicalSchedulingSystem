const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Doctor = new Schema({
    username: {
        type: String,
    },
    mfid: {
        type: [MedicalField],
    },
    did: {
        type: Number,
    },
    details: {
        type: String,
    },
});

module.exports = mongoose.model('Doctor',Doctor);;