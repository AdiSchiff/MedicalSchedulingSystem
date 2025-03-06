const MFService = require('../services/Medical_fields');
const loginController = require("./Login");

const getMF = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const medical_fields = await MFService.getMedicalFields();
        if (!medical_fields) {
            return res.status(500).send("Something went wrong");
        }
        return res.status(200).json(medical_fields);
    } catch (error) {
        alert(error)
    }
};

module.exports = { getMF }