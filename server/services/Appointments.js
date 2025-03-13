const Appointments = require('../models/Appointments');

async function defineApid(AppointmentModel) {
    let currentAppointment = await AppointmentModel.findOne().sort({ apid: -1 }).select('apid').lean();
    let newApid = currentAppointment ? currentAppointment.apid + 1 : 1;
    return newApid;
}

const createNewAppointment = async (date, did, pid, mfid) => {
    const apid = await defineApid(Appointments); // Get the next available apid

    const newAppointment = new Appointments({
        date: date,
        did: did,
        pid: pid,
        mfid: mfid,
        free: false,
        apid: apid,
    });
    return await newAppointment.save();
};

const cancelAppointment = async (apid) => {
    return Appointments.findOneAndUpdate(
        { apid: apid }, 
        { $set: { free: true } }, 
        { new: true }
    );
};

const getAppointmentsByPID = async (pid) => {
    return await Appointments.find({ pid: pid, free: false });
};

const getAppointmentsByNotFree = async () => {
    return await Appointments.find({ free: false });
};

const getAppointmentByIDs = async (date, did) => {
    return await Appointments.findOne({date, did, free: false});
};

module.exports = { getAppointmentsByPID, cancelAppointment, getAppointmentByIDs, getAppointmentsByNotFree, createNewAppointment }