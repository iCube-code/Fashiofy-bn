const User = require("../model/UserModel");
const logger = require("../utils/logger");
const Validator = require("../utils/validator");

async function forgotPasswordService(email) {
  try {
    if (!email || typeof email !== "string") {
      return {
        isEmailFound: false,
        error: "Invalid email format",
      };
    }

    const emailValidator = new Validator();
    const validEmail = emailValidator.validateEmail(email);

    if (
      validEmail === "Not a Valid Email" ||
      validEmail === "Something went wrong"
    ) {
      return {
        isEmailFound: false,
        error: `Validation failed: ${validEmail}`,
      };
    }

    const isExistingUser = await User.findOne({ email: validEmail })
      .select("firstName lastName email _id")
      .lean();

    if (!isExistingUser) {
      return {
        isEmailFound: false,
      };
    }

    const userData = {
      userid: isExistingUser._id,
      userFullName: `${isExistingUser.firstName || ""} ${
        isExistingUser.lastName || ""
      }`.trim(),
      userEmail: isExistingUser.email,
    };

    return { isEmailFound: true, userData };
  } catch (error) {
    logger.error(`Error in forgotPasswordService : ${error.message}`, {
      stack: error.stack,
      email,
    });
    return {
      isEmailFound: false,
      error: "Internal server error",
    };
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
