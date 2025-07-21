const Role = require("../model/roleModel");
const User = require("../model/UserModel");
const { emailVerificationLink } = require("../utils/emailVerficationLink");
const logger = require("../utils/logger");

async function sellerAccountService(
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  organization,
  shopAddress
) {
  try {
    const existingUser = await User.findOne({ email }).select("-password");
    if (existingUser) {
      return {
        status: 409,
        message: "Seller already exists",
      };
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      organization,
      shopAddress,
      isActive: false,
    });

    const createUserRole = await Role.create({ roleName: "Seller" });
    if (!createUserRole) {
      logger.error(`Unable to create user role for user: ${email}`);
      return {
        status: 500,
        message: "Unable to create user role",
      };
    }

    user.fk_role_id = createUserRole._id;
    await user.save();

    try {
      await emailVerificationLink(user);
      logger.info(`Verification email sent to: ${email}`);
    } catch (emailError) {
      logger.error(
        `Failed to send verification email to ${email}: ${emailError.message}`,
        {
          error: emailError,
        }
      );
      return {
        status: 500,
        message: "Failed to send verification email",
        error: emailError.message,
      };
    }

    return {
      status: 201,
      message: "Seller account successfully created. Verification email sent.",
      data: { userId: user._id, email },
    };
  } catch (error) {
    logger.error(
      `Error creating seller account for ${email}: ${error.message}`,
      { error }
    );
    return {
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

module.exports = { sellerAccountService };
