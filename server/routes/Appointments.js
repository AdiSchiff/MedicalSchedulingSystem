const express = require('express');
const router = express.Router();

const appointmentsController = require('../controllers/Appointments');

router.route('/')
    .post(appointmentsController.cancelAppointments)
    .get(appointmentsController.getBookedAppointments);
router.route('/:pid')
    .get(appointmentsController.getMyAppointments)
    .post(appointmentsController.bookAppointment);

module.exports = router;
