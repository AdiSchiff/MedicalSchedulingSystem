const express = require('express');
const router = express.Router();

const mfController = require('../controllers/Medical_fields');

router.route('/')
    .get(mfController.getMF);

module.exports = router;
