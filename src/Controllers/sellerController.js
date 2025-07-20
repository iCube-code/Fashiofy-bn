const {
  sellerAccountService,
  verifySellerAccountService,
} = require("../service/sellerService");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

const registerSeller = async (req, res) => {
  try {
    if ((!req.user || !req.user._id) && !req.body.userId) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized: User not authenticated",
      });
    }

    if (!req.user._id === req.body.userId) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid user ID",
      });
    }

    const result = await sellerAccountService(userId);

    if (result.status >= 400) {
      return res.status(result.status).json({
        status: "failure",
        message: result.message,
      });
    }

    logger.info(`Seller registered successfully for user ID: ${userId}`);
    return res.status(result.status).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(`Error registering seller: ${error.message}`, error);
    return res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const verifySeller = async (req, res) => {
  try {
    if ((!req.user || !req.user._id) && !req.body.verificationToken) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized: User not authenticated",
      });
    }

    const result = await verifySellerAccountService(req.body.verificationToken);

    if (result.status >= 400) {
      return res.status(result.status).json({
        status: "failure",
        message: result.message,
      });
    }

    res.status(result.status).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error(`Error verifying seller: ${error.message}`, error);
    return res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerSeller, verifySeller };
