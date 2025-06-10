const { userService } = require('../service/login');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');

async function login(req, res) {
    try {
        let user = new userService();
        const existingUser = user.getUser(req.body.email);
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found', success: false });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: 'wrong password', success: false });
        }
        const token = generateToken(existingUser);
        res.json({ token: token });

    } catch (err) {
        res.status(401).json({ message: "Invalid Credentials" });
    }
}
module.exports = { login }