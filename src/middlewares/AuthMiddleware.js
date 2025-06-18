const jwt = require("jsonwebtoken");
const { secretKey } = require('../config/jwtConfig');
const logger = require("../utils/logger.js");
const User = require('../model/UserModel.js');


const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            logger.error("No token provided");
            return res.status(401).json({ message: "No token provided" });
        }
        const decodedToken = jwt.verify(token, secretKey);
        userData = decodedToken;
        const user = await User.findById(userData._id);
        req.user = user;
        next();

    } catch (error) {
        logger.error("Invalid Token");
        return res.status(401).json({ message: "Invalid Token" })
    }

}
module.exports = authMiddleWare;