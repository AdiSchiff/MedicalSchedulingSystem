const userService = require('../services/Users');
const jwt = require("jsonwebtoken");

const key = "Secret"

const getOTP = async (req, res) => {
    const phone = req.body.phone;
    try {
        const otp = () => Math.floor(1000 + Math.random() * 9000);
        const result = await userService.updateOTP(phone, otp)
        if (result) {
            res.status(200).json(otp); 
        } else
            res.status(404).send('User with the given phone number was not found')
    } catch (error) {
        res.status(500).send('Sorry, we got an error')
    }
}

const login = async (req, res) => {
    const phone = req.body.phone;
    const recievedOTP = req.params.opt;
    try {
        const user = await userService.getUser(phone)
        if(user){
            const originOTP = user.opt
            if(originOTP==recievedOTP){
                const data = {
                    username: user.username,
                    pid: user.pid,
                }
                const token = jwt.sign(data, key);
                res.status(200).json(token);
            } else {
                return res.status(401).send();
            }
        } else
            res.status(404).send('User with the given phone number was not found')
    } catch (error) {
        res.status(500).send('Sorry, we got an error')
    }
}

function isLoggedIn(token) {
    try {
        const modifiedToken = token.substring(1, token.length - 1);
        const decoded = jwt.verify(modifiedToken, key);
        // Token verification successful
        return decoded.pid
    } catch (error) {
        // Token verification failed
        return -1
    }
}


module.exports = { getOTP, login, isLoggedIn }