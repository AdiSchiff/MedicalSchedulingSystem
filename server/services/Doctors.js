const Doctors = require('../models/Doctors');

const getDoctors = async () => {
    return await Doctors.find();
};

module.exports = { getDoctors }