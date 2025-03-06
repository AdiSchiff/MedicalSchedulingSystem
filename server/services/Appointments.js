const Appointments = require('../models/Appointments');

//Generate a apid by Auto Increment
async function defineApid(AppointmentModel) {
    let currentAppointment = await AppointmentModel.findOne().sort({ pid: -1 }).select('apid').lean();
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

const bookAppointment = async (apid, pid) => {
    return await Appointments.findOneAndUpdate(
        { apid: apid },
        { $set: { free: false, pid: pid } }, 
        { new: true }
    );
};

const cancelAppointment = async (apid) => {
    return Appointments.findOneAndUpdate(
        { apid: apid }, 
        { $set: { free: true, pid: null } }, 
        { new: true }
    );
};

const getAppointmentsByPID = async (pid) => {
    return await Appointments.find({ pid: pid });
};

const getAppointmentsByNotFree = async () => {
    return await Appointments.find({ free: false });
};

const getAppointmentByAPID = async (apid) => {
    return await Appointments.findById(apid);
};

module.exports = { getAppointmentsByPID, cancelAppointment, bookAppointment, getAppointmentByAPID, getAppointmentsByNotFree, createNewAppointment }