const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/Doctors');

router.route('/')
    .get(doctorController.getDoctors);

module.exports = router;
