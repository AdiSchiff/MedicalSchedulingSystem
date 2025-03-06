const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MF = new Schema({
    speciality: {
        type: String,
    },
    mfid: {
        type: Number,
    },
});

module.exports = mongoose.model('MedicalField',MF);
