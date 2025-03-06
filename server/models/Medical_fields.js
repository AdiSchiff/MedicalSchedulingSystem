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

const mf = mongoose.model('MedicalField',MF);
module.exports = { mf };