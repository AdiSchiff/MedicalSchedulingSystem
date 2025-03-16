const User = require('../models/Users');

const getUser = async (phone) => {
    return await User.findOne({phone: phone});
};

const notNew = async (pid) => {
    return await User.findOneAndUpdate(
        { pid: pid }, // Find user by pid
        { $set: { isNewUser: false } }, // Update 'new' attribute to false
        { new: true }
    );
};

const updateOTP = async (phone, otp) => {
    return await User.findOneAndUpdate(
        { phone: phone }, // Find user by phone
        { $set: { otp: otp } }, // Update 'otp' attribute to the current one
        { new: true }
    );
};

const getUsersByPids = async (pids) => {
    return User.find({ pid: { $in: pids } });    
};

module.exports = { getUser, notNew, updateOTP, getUsersByPids };

