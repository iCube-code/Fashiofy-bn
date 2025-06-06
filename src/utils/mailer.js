const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Expects an Object Configuration : {recipient mail,subject,html}

const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("Email Sent:", info.messageId);
};

module.exports = sendEmail;
