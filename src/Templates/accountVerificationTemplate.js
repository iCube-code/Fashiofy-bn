const sanitizeHtml = require("sanitize-html");
const CryptoJS = require("crypto-js");

const EMAIL_CONFIG = {
  companyName: process.env.COMPANY_NAME || "Fashiofy",
  supportTeam: process.env.SUPPORT_TEAM || "Support Team",
  brandColor: process.env.BRAND_COLOR || "#1a73e8",
  defaultName: "User",
};

function accountVerificationTemplate(userFullName, verificationLink) {
  if (!verificationLink || typeof verificationLink !== "string") {
    throw new Error("Invalid or missing seller account verification link");
  }

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(verificationLink)) {
    throw new Error("Invalid URL format for seller account verification link");
  }

  const safeName =
    userFullName && typeof userFullName === "string"
      ? sanitizeHtml(userFullName, { allowedTags: [], allowedAttributes: {} })
      : EMAIL_CONFIG.defaultName;

  const safeLink = sanitizeHtml(verificationLink, {
    allowedTags: [],
    allowedAttributes: {},
  });

  let validForMinutes;
  try {
    if (!process.env.CRYPTO_SECRET) {
      throw new Error("Encryption secret is not configured");
    }

    const encryptedSegment = verificationLink.split("/verify-account/")[1];
    if (!encryptedSegment) {
      throw new Error("Missing encrypted token in seller verification link");
    }

    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedSegment),
      process.env.CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    const { expiresAt } = JSON.parse(decrypted);
    const expiryDate = new Date(expiresAt);

    if (isNaN(expiryDate.getTime())) {
      throw new Error("Invalid expiration time in token");
    }

    const now = Date.now();
    if (expiryDate <= now) {
      throw new Error("Seller account verification link has expired");
    }

    validForMinutes = Math.max(0, Math.floor((expiryDate - now) / (1000 * 60)));
  } catch (err) {
    throw new Error(
      `Failed to process seller verification link: ${err.message}`
    );
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Seller Account Verification - ${EMAIL_CONFIG.companyName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: ${EMAIL_CONFIG.brandColor};
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color: #1557b0;
        }
        .footer {
          margin-top: 24px;
          font-size: 14px;
          color: #666666;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 15px;
          }
          .button {
            padding: 10px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Hi <strong>${safeName}</strong>,</p>
        <p>Thank you for applying to become a seller with ${EMAIL_CONFIG.companyName}! To complete your seller account setup, please verify your account by clicking the button below:</p>
        <p style="margin: 24px 0;">
          <a href="${safeLink}" class="button" title="Verify your seller account">Verify Your Seller Account</a>
        </p>
        <p>This verification link is valid for approximately ${validForMinutes} minute(s).</p>
        <p>Once verified, you can start listing your products and selling with us. If you didn’t apply to become a seller, please ignore this email or contact our support team.</p>
        <div class="footer">
          <p>Best regards,<br><strong>${EMAIL_CONFIG.companyName} ${EMAIL_CONFIG.supportTeam}</strong></p>
        </div>
      </div>
      <!-- Plain text fallback for non-HTML email clients -->
      <div style="display: none; font-size: 0; max-height: 0; overflow: hidden;">
        Hi ${safeName},

        Thank you for applying to become a seller with ${EMAIL_CONFIG.companyName}! To complete your seller account setup, please verify your account by visiting this	link: ${safeLink}

        This verification link is valid for approximately ${validForMinutes} minutes.

        Once verified, you can start listing your products and selling with us. If you didn’t apply to become a seller, please ignore this email or contact our support team.

        Best regards,
        ${EMAIL_CONFIG.companyName} ${EMAIL_CONFIG.supportTeam}
      </div>
    </body>
    </html>
  `;
}

module.exports = { accountVerificationTemplate };
