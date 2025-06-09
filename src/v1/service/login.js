const bcrypt = require('bcrypt');
const User = require('../model/UserModel');
const { generateToken } = require('../utils/jwtUtils');

class userService {
    async login(email, password) {
        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(403).json({ message: 'User not found', success: false });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordValid) {
                return res.status(403).json({ message: 'wrong password', success: false });
            }
            const token = generateToken(existingUser);
            return token;
        } catch (err) {
            return res.status(500).json({ message: err.message, success: false });

        }
    }
}
module.exports = { userService }  