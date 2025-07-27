const { sellerAccountService } = require("../service/sellerService");
const logger = require("../utils/logger");

const registerSeller = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      organization,
      shopAddress,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !organization ||
      !shopAddress
    ) {
      return res.status(400).json({
        status: "failure",
        message: "All fields are required",
      });
    }

    const result = await sellerAccountService(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      organization,
      shopAddress
    );

    if (!result || result.status >= 400) {
      return res.status(result?.status || 400).json({
        status: "failure",
        message: result?.message || "Failed to register seller",
      });
    }

    logger.info(`Seller registered successfully: ${email}`);
    return res.status(result.status).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(`Error registering seller: ${error.message}`, {
      error,
      email,
    });
    return res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerSeller };
