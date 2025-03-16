const Family = require('../models/Family');

const getFamily = async (fid) => {
    return await Family.findOne({fid});
};

module.exports = { getFamily }