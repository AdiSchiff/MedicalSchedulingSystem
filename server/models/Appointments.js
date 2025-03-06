const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Appointment = new Schema({
    date: {
        type: Date,
    },
    did: {
        type: Number,
    },
    pid: {
        type: Number,
    },
    apid: {
        type: Number,
    },
    free: {
        type: Boolean,
    },
    mfid: {
        type: Number,
    },
});

module.exports = mongoose.model('Appointment',Appointment);
