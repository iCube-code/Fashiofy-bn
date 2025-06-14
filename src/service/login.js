const User = require('../model/UserModel');
class userService {
    async getUser(email) {
        try {
            return await User.findOne({ email });

        } catch (err) {
            console.log("error in getting user",err);
        }
    }
}
module.exports = { userService }  