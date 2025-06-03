const nodemailer = require("nodemailer");

/**
 * Sends an email.
 * @param {Object} params
 * @param {string} params.to - Who to send the email to
 * @param {string} params.subject - The email subject
 * @param {string} params.html - The HTML body
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure:false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Expects an Object Configuration : {recipient mail,subject,html}

const sendEmail = async ({ recipient, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("Email Sent:", info.messageId);
};

module.exports = sendEmail;
