const { userService } = require("../service/login");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const User = require("../model/UserModel");
const logger = require("../utils/logger");
const { forgotPasswordService } = require("../service/userService");
const { generateForgotPasswordLink } = require("../utils/linkGenerator");
const sendEmail = require("../utils/mailer");
const { forgotPasswordTemplate } = require("../Templates/forgotPassword");
const { resetPasswordService, verifyEmailService } = require("../service/userService");
const { secretKey } = require("../config/jwtConfig");
const {emailVerificationLink} = require("../utils/emailVerficationLink");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      const error = createHttpError(400, "All fields are required");
      logger.error("All fields are required");
      return next(error);
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      const error = createHttpError(400, "User already exit!");
      logger.error("User already exit!");
      return next(error);
    }

    const user = { firstName, lastName, email, password, phoneNumber };
    const newUser = User(user);
    await newUser.save();
    await emailVerificationLink(newUser);

    res
      .status(201)
      .json({ success: true, message: "New user created! Verification email sent.", data: newUser });
  } catch (error) {
    next(error);
  }
};

async function login(req, res) {
  try {
    let user = new userService();
    const existingUser = await user.getUser(req.body.email);
    if (!existingUser) {
      logger.error("User not found");
      return res
        .status(403)
        .json({ message: "User not found", status: false });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      logger.error("wrong password");
      return res
        .status(403)
        .json({ message: "wrong password", status: false });
    }

    const token = generateToken(existingUser);
    logger.info(token);
    res.json({ token: token });
  } catch (err) {
    logger.error("Invalid Credentials", err);
    res.status(401).json({ message: "Invalid Credentials" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const { isEmailFound, userData, error } = await forgotPasswordService(
      email
    );

    const defaultResponse = {
      message:
        "if this mail is exists we will send a mail for resetting password.",
    };

    if (error) {
      logger.warn(`Invalid email or service error: ${email}`, { error });
      return res.status(400).json({
        message: "Invalid email format or service error",
      });
    }

    if (!isEmailFound || !userData) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json(defaultResponse);
    }

    const forgotPasswordLink = await generateForgotPasswordLink(userData);
    await sendEmail(
      userData.userEmail,
      "Reset Your Password",
      forgotPasswordTemplate(userData.userFullName, forgotPasswordLink)
    );

    logger.info(`Password reset email sent to: ${userData.userEmail}`);
    return res.status(200).json(defaultResponse);
  } catch (error) {
    const errorId = generateErrorId();
    logger.error(`Forgot password error [${errorId}]: ${error.message}`, {
      stack: error.stack,
      email,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
      errorId,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        message: "User ID and new password are required",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    // Call the service
    const result = await resetPasswordService(userId, newPassword);

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    logger?.error(`Error in resetPassword controller: ${error}`);
    return res.status(500).json({ message: "Error resetting password" });
  }
}

async function verifyEmail(req, res) {
  const { email, userId } = req.body;
  if (!email || !userId) {
    logger.error("Email and userId are required");

    return res.status(400).json({ message: "something went wrong" });
  }
  try {

    const user = await verifyEmailService(email, userId);
    if (!user) {
      logger.error("User not found!");
      return res.status(400).json({ message: "something went wrong" });
    }
    user.isActive = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully", status: true, isActive: user.isActive });
  } catch (err) {
    logger.error("Server error", err);

    res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = { register, login, forgotPassword, resetPassword, verifyEmail };
