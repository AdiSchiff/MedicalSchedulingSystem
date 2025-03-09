const User = require('../models/Users');

const getUser = async (phone) => {
    return User.findOne({phone: phone});
};

const notNew = async (pid) => {
    return User.findOneAndUpdate(
        { pid: pid }, // Find user by pid
        { $set: { isNewUser: false } }, // Update 'new' attribute to false
        { new: true }
    );
};

const updateOTP = async (phone, otp) => {
    return User.findOneAndUpdate(
        { phone: phone }, // Find user by phone
        { $set: { otp: otp } }, // Update 'otp' attribute to the current one
        { new: true }
    );
};

module.exports = { getUser, notNew, updateOTP };

