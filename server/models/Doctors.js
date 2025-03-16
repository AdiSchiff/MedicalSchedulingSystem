const mongoose = require('mongoose');
const MedicalField = require('./Medical_fields');

const Schema = mongoose.Schema;
const Doctor = new Schema({
    username: {
        type: String,
    },
    mfids: {
        type: [MedicalField.mfid],
    },
    did: {
        type: Number,
    },
    details: {
        type: String,
    },
});

module.exports = mongoose.model('Doctor',Doctor);