const DoctorsService = require('../services/Doctors');
const loginController = require("./Login");

const getDoctors = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const doctors = await DoctorsService.getDoctors();
        if (!doctors) {
            return res.status(500).send("Something went wrong");
        }
        return res.status(200).json(doctors);
    } catch (error) {
        alert(error)
    }
};

module.exports = { getDoctors }