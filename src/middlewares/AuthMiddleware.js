const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");
const User = require('../model/UserModel.js');

const authMiddleWare = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            logger.error("No token provided");
            return res.status(401).json({ message: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();

    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.error("Token expired", error);
            return res.status(401).json({ message: "Token expired", expiredAt: error.expiredAt });
        }
        logger.error("Invalid Token", error);
        return res.status(401).json({ message: "Invalid Token" })
    }
}
module.exports = authMiddleWare;