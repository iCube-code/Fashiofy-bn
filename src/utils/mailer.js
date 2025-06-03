const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: '<h1>Welcome!</h1><p>Thanks for signing up to Fashiofy.</p>',
  };
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
