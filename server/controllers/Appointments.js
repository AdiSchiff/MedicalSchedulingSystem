const AppointmentsService = require('../services/Appointments');
const loginController = require("./Login");

const bookAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const apid = req.body.apid;
        if(apid!=null){
            const alreadyExists = await AppointmentsService.getAppointmentByAPID(apid)
            if (alreadyExists) {
                if(alreadyExists.free){
                    const appointment = await AppointmentsService.bookAppointment(apid, req.params.pid)
                    if(!appointment){
                        return res.status(500).json("Somthing went wrong try again");
                    } else {
                        return res.status(200).json(appointment);
                    }
                } else {
                    return res.status(409).json("This appointment is already booked");
                }
            } else {
                return res.status(404).json("This apid was not found");
            }
        } else {
            const newAppointment = await AppointmentsService.createNewAppointment( req.body.date, req.body.did, req.params.pid, req.body.mfid)
            if(!newAppointment){
                return res.status(500).json("Somthing went wrong try again");
            } else {
                return res.status(200).json(newAppointment);
            }
        }
    } catch (error) {
        alert(error)
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const myAppointments = await AppointmentsService.getAppointmentsByPID(req.params.pid);
        if (!myAppointments || myAppointments.length === 0) {
            return res.status(404).send("No appointments found for the given pid");
        }
        return res.status(200).json(myAppointments);
    } catch (error) {
        alert(error)
    }
};

const getBookedAppointments = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }

        const bookedAppointments = await AppointmentsService.getAppointmentsByNotFree();
        if (!bookedAppointments || bookedAppointments.length === 0) {
            return res.status(404).send("No booked appointments were found");
        }

        // Filter only future appointments
        const currentTime = new Date();
        const futureAppointments = bookedAppointments.filter(app => new Date(app.date) >= currentTime);

        // Return only required attributes: date, did, apid, mfid
        const filteredAppointments = futureAppointments.map(({ date, did, apid, mfid }) => ({ date, did, apid, mfid }));

        if (filteredAppointments.length === 0) {
            return res.status(404).send("No future booked appointments were found");
        }

        return res.status(200).json(filteredAppointments);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const appointment = await AppointmentsService.cancelAppointment(req.body.apid);
        if (!appointment) {
            return res.status(404).send("Wrong apid");
        }
        return res.status(200).json(appointment);
    } catch (error) {
        alert(error)
    }
};

module.exports = { getBookedAppointments, getMyAppointments, bookAppointment, cancelAppointment }