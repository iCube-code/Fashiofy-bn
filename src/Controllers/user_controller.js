const { userService } = require('../service/login');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');
const createHttpError = require("http-errors");
const User = require("../model/UserModel");


const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      const error = createHttpError(400, "User already exit!");
      return next(error);
    }

    const user = { firstName, lastName, email, password, phoneNumber };
    const newUser = User(user);
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "New user created!", data: newUser });
  } catch (error) {
    next(error);
  }

  
};

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
module.exports = {register, login }