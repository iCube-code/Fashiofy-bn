const User = require("../model/UserModel");
const logger = require("../utils/logger");

async function forgotPasswordService(email) {
  try {
    const isExistingUser = await User.findOne({ email }).select("-password");
    if (!isExistingUser) {
      return {
        isEmailFound: false,
      };
    }

    const userData = {
      userid: isExistingUser.id,
      userFullName: `${isExistingUser.firstName} ${isExistingUser.lastName}`,
      userEmail: `${isExistingUser.email}`,
    };

    return { isEmailFound: true, userData };
  } catch (error) {
    logger.error(error);
    return error;
  }
}

async function resetPasswordService(userId, hashedPassword) {
  try {
    if (!userId || !hashedPassword) {
      return {
        status: 400,
        message: "User ID and password are required",
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    user.password = hashedPassword;
    await user.save();

    return {
      status: 200,
      message: "Password reset successfully",
    };
  } catch (error) {
    logger?.error(`Error occurred in resetPasswordService: ${error}`);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

module.exports = { forgotPasswordService, resetPasswordService };
