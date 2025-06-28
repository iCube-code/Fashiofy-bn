const User = require('../model/UserModel');
const Role = require('../model/roleModel');

const logger = require("../utils/logger");

class userService {
    async getUser(email) {
        try {
            return await User.findOne({ email }).populate('fk_role_id', 'roleName');

        } catch (err) {
            logger.error("error in getting user", err);
        }
    }
}
module.exports = { userService }  