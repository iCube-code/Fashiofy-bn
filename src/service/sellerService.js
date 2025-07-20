// sellerAccountService.js (and verifySellerAccountService)
const mongoose = require("mongoose");
const Role = require("../model/roleModel");
const User = require("../model/UserModel");
const logger = require("../utils/logger");
const { generateLink } = require("../utils/linkGenerator");
const sendEmail = require("../utils/mailer");
const CryptoJS = require("crypto-js");
const {
  accountVerificationTemplate,
} = require("../Templates/accountVerificationTemplate");

async function sellerAccountService(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: 400,
        message: "Invalid user ID",
      };
    }

    const findUser = await User.findById(userId).select("-password");
    if (!findUser) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const checkIfRoleIdExists = await Role.findById(findUser.fk_role_id);
    if (checkIfRoleIdExists) {
      return {
        status: 400,
        message: "User already has a role",
      };
    }

    const createUserRole = await Role.create({ roleName: "Seller" });
    if (!createUserRole) {
      logger.error(`Unable to create user role for User: ${findUser.email}`);
      return {
        status: 500,
        message: "Unable to create user role",
      };
    }

    findUser.fk_role_id = createUserRole._id;
    findUser.isActive = false;
    await findUser.save();

    const userData = {
      userid: findUser._id.toString(),
      userFullName: `${findUser.firstName || ""} ${
        findUser.lastName || ""
      }`.trim(),
      userEmail: findUser.email,
    };

    try {
      const verifyAccountLink = await generateLink(userData, "verifyAccount");
      await sendEmail(
        userData.userEmail,
        "Verify Your Seller Account",
        accountVerificationTemplate(userData.userFullName, verifyAccountLink)
      );
      logger.info(
        `Verification Email Sent To Seller Email: ${userData.userEmail}`
      );
    } catch (emailError) {
      logger.error(`Failed to send verification email: ${emailError.message}`);
      return {
        status: 500,
        message: "Failed to send verification email",
        error: emailError.message,
      };
    }

    return {
      status: 201,
      message:
        "Seller Account Successfully Created. An email has been sent to verify your account.",
    };
  } catch (error) {
    logger.error("Internal Server Error", error);
    return {
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

async function verifySellerAccountService(verificationToken) {
  try {
    if (!verificationToken) {
      return {
        status: 400,
        message: "Verification token is required",
      };
    }

    if (!process.env.CRYPTO_SECRET) {
      throw new Error("Crypto secret key is not configured");
    }

    let payload;
    try {
      const decryptData = CryptoJS.AES.decrypt(
        decodeURIComponent(verificationToken),
        process.env.CRYPTO_SECRET
      );
      payload = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
    } catch (decryptionError) {
      logger.error(`Decryption failed: ${decryptionError.message}`);
      return {
        status: 400,
        message: "Invalid or corrupted verification token",
      };
    }

    const { userid, expiresAt } = payload;
    if (!userid || !mongoose.Types.ObjectId.isValid(userid)) {
      return {
        status: 400,
        message: "Invalid user ID",
      };
    }

    if (!expiresAt || Date.now() > expiresAt) {
      return {
        status: 400,
        message: "Verification token has expired",
      };
    }

    const user = await User.findById(userid).select("-password");
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const userRole = await Role.findById(user.fk_role_id);
    if (!userRole) {
      return {
        status: 400,
        message: "Invalid user role",
      };
    }

    if (user.isActive) {
      return {
        status: 400,
        message: "Account is already verified",
      };
    }

    user.isActive = true;
    const updatedUser = await user.save();

    return {
      status: 200,
      message: "Account verification successful",
      data: updatedUser,
    };
  } catch (error) {
    logger.error("Error in verifySellerAccountService", {
      error: error.message,
      stack: error.stack,
    });
    return {
      status: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
}

module.exports = { sellerAccountService, verifySellerAccountService };
