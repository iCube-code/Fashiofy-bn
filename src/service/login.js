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
    async updateUserById(id, isActive) {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                { isActive: isActive },
                { new: true, runValidators: true }
            );
            return user;
        } catch (err) {
            logger.error("error in updating user", err);
        }
    }
}
module.exports = { userService }  