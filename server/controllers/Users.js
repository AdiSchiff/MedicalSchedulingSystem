const userService = require('../services/Users');
const loginController = require("./Login");

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!await loginController.isLoggedIn(token)) {
            return res.status(401).send();
        }
        const user = await userService.getUser(req.params.phone);
        if (!user) {
            return res.status(404).send(null);
        }
        //If the user is new update that now he is not 
        if(user.isNewUser==true){
            await userService.notNew(user.pid);
        }
        return res.status(200).json({
            username: user.username,
            pid: user.pid,
            isNew: user.isNewUser
        });
    } catch (error) {
        alert(error)
    }
};

module.exports = { getUser }