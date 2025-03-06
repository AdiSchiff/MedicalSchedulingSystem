const express = require('express');
const router = express.Router();

const userController = require('../controllers/Users');

router.route('/:phone').get(userController.getUser);

module.exports = router;
