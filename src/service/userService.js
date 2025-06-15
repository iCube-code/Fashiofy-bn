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
    return error;
    logger.error(error);
  }
}

module.exports = { forgotPasswordService };
