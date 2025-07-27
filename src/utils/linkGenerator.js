const CryptoJS = require("crypto-js");
const logger = require("./logger");

const LINK_CONFIG = {
  pathPrefixForForgotPassword: "/forgot-password",
  pathPrefixForAccountVerification: "/verify-account",
  expirationMs: 5 * 60 * 1000,
};

async function generateLink(userData, issueType) {
  try {
    if (!userData || !userData.userid || !issueType) {
      throw new Error("Invalid or missing user data or issueType");
    }
    if (!process.env.CRYPTO_SECRET) {
      throw new Error("Missing CRYPTO_SECRET");
    }
    if (!process.env.CLIENT_URL) {
      throw new Error("Missing CLIENT_URL");
    }

    const payload = JSON.stringify({
      userid: userData.userid.toString(),
      expiresAt: Date.now() + LINK_CONFIG.expirationMs,
    });

    const encryptedData = CryptoJS.AES.encrypt(
      payload,
      process.env.CRYPTO_SECRET
    ).toString();

    const generatedLink = `${process.env.CLIENT_URL.replace(/\/+$/, "")}${`${
      issueType === "forgotPassword"
        ? LINK_CONFIG.pathPrefixForForgotPassword
        : LINK_CONFIG.pathPrefixForAccountVerification
    }`}/${encodeURIComponent(encryptedData)}`;

    return generatedLink;
  } catch (error) {
    logger.error(`Error generating link: ${error.message}`);
    throw new Error("Failed to generate link");
  }
}

module.exports = { generateLink };
