const nodemailer = require("nodemailer");
const logger = require("./src/utils/logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    logger.error("EMAIL STATUS:FAILED", e);
  }
};

module.exports = sendEmail;
