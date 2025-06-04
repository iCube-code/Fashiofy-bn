const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: 'User not found', success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: 'wrong password', success: false });
        }
        const jwtToken = jwt.sign({
            username:user.firstName+user.lastName,
            email: user.email,
            _id: user._id
        },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        res.status(200).json({
            message: 'login success',
            success: true,
            jwtToken,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        },

        )
    }
}
module.exports = {
    login
}