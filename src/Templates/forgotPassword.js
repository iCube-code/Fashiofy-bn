const sanitizeHtml = require("sanitize-html");
const CryptoJS = require("crypto-js");

const EMAIL_CONFIG = {
  companyName: "Fashiofy",
  supportTeam: "Support Team",
  brandColor: "#1a73e8",
  defaultName: "User",
};

function forgotPasswordTemplate(userFullName, forgotPasswordLink) {
  if (!forgotPasswordLink || typeof forgotPasswordLink !== "string") {
    throw new Error("Invalid or missing forgot password link");
  }

  const safeName =
    userFullName && typeof userFullName === "string"
      ? sanitizeHtml(userFullName, { allowedTags: [], allowedAttributes: {} })
      : EMAIL_CONFIG.defaultName;

  let validForMinutes;

  try {
    const encryptedSegment = forgotPasswordLink.split("/forgot-password/")[1];
    if (!encryptedSegment) throw new Error("Missing encrypted token");

    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedSegment),
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    const { expiresAt } = JSON.parse(decrypted);
    const expiryDate = new Date(expiresAt);

    if (isNaN(expiryDate.getTime())) throw new Error("Invalid expiration time");

    validForMinutes = Math.max(
      0,
      Math.floor((expiryDate - Date.now()) / (1000 * 60))
    );
  } catch (err) {
    throw new Error("Failed to extract expiration time from the link");
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td>
            <p style="margin-bottom: 16px;">Hi <strong>${safeName}</strong>,</p>
            <p style="margin-bottom: 16px;">We received a request to reset your password. Click the button below to reset it:</p>
            <p style="margin-bottom: 16px;">
              <a href="${forgotPasswordLink}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #f0f0f0;
                color: ${EMAIL_CONFIG.brandColor};
                text-decoration: none;
                font-weight: bold;
                border-radius: 6px;
              ">
                Reset Password
              </a>
            </p>
            <p style="margin-bottom: 16px;">This link is valid for approximately ${validForMinutes} minute(s).</p>
            <p style="margin-bottom: 16px;">If you didn’t request this, you can safely ignore this email.</p>
            <p style="margin-top: 24px;">Best regards,<br><strong>${EMAIL_CONFIG.companyName} ${EMAIL_CONFIG.supportTeam}</strong></p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = { forgotPasswordTemplate };
