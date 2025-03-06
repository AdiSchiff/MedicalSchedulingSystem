const User = require('../models/Users');

const getUser = async (phone) => {
    return User.findOne({phone: phone});
};

const notNew = async (pid) => {
    return User.findOneAndUpdate(
        { pid: pid }, // Find user by pid
        { $set: { new: false } }, // Update 'new' attribute to false
    );
};

const updateOTP = async (phone, otp) => {
    return User.findOneAndUpdate(
        { phone: phone }, // Find user by phone
        { $set: { otp: otp } }, // Update 'otp' attribute to the current one
    );
};

module.exports = { getUser, notNew, updateOTP };

