const MF = require('../models/Medical_fields');

const getMedicalFields = async () => {
    return await MF.find();
};

module.exports = { getMedicalFields }