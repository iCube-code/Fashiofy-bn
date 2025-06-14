const CryptoJS = require("crypto-js");

function generateForgotPasswordLink(userData) {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      userData.id,
      process.env.CRYPTO_SECRET
    ).toString();

    const forgotPasswordLink = `${process.env.CLIENT_URL}/forgot-password/${encryptedData}`;

    return forgotPasswordLink;
  } catch (error) {
    return "Error generating forgot-password link", error;
  }
}

module.exports = { generateForgotPasswordLink };
