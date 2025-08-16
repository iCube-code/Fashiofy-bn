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

async function verifyEmailService(email, userId) {
  try {
    const user = await User.findOne({ email, _id: userId });
    return user;
  } catch (e) {
    logger.error("error in user EmailVerfication", err);
  }
}

async function fetchUserService() {
  try {
    const users = await User.find().select("-password -__v");

    return {
      status: 200,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    logger.error("Database error in fetchUserService:", error);
    return {
      status: 500,
      message: "Unable to fetch users",
      data: null,
    };
  }
}
module.exports = {
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  fetchUserService,
};
