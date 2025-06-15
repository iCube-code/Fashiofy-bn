const User = require('../model/UserModel');
const logger = require("./src/utils/logger");

class userService {
    async getUser(email) {
        try {
            return await User.findOne({ email });

        } catch (err) {
           logger.error("error in getting user",err);
        }
    }
}
module.exports = { userService }  