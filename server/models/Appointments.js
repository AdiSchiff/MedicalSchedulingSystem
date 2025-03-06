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

const appointment = mongoose.model('Appointment',Appointment);
module.exports = { appointment };