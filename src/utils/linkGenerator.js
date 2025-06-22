const CryptoJS = require("crypto-js");
const logger = require("./logger");

const LINK_CONFIG = {
  pathPrefix: "/forgot-password",
  expirationMs: 5 * 60 * 1000,
};

async function generateForgotPasswordLink(userData) {
  try {
    if (!userData || !userData.userid) {
      throw new Error("Invalid or missing user data");
    }
    if (!process.env.CRYPTO_SECRET) {
      throw new Error("Missing CRYPTO_SECRET");
    }
    if (!process.env.CLIENT_URL) {
      throw new Error("Missing CLIENT_URL");
    }

    const payload = JSON.stringify({
      userid: userData.userid,
      expiresAt: Date.now() + LINK_CONFIG.expirationMs,
    });

    const encryptedData = CryptoJS.AES.encrypt(
      payload,
      process.env.CRYPTO_SECRET
    ).toString();

    const forgotPasswordLink = `${process.env.CLIENT_URL.replace(/\/+$/, "")}${
      LINK_CONFIG.pathPrefix
    }/${encodeURIComponent(encryptedData)}`;

    return forgotPasswordLink;
  } catch (error) {
    logger.error(`Error generating forgot password link: ${error.message}`);
    throw new Error("Failed to generate forgot password link");
  }
}

module.exports = { generateForgotPasswordLink };
