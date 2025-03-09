const loginController = require('../controllers/Login');

const express = require('express');
var router = express.Router();

router.route('/').post(loginController.getOTP);
router.route('/otp').post(loginController.login);

module.exports = router;