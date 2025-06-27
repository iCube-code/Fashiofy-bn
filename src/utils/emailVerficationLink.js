const jwt = require("jsonwebtoken");
const sendEmail = require('./mailer');
const logger = require("./logger");

const emailVerificationLink = async (user) => {
    try {
        const payload = {
            userId: user._id,
            email: user.email
        }
        const SECRET = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });

        const verficationUrl = `https://fashiofy.onrender.com/account/verify/${SECRET}`;

        const htmlMessage = `
            <div  style="font-family: Arial, sans-serif;">
                <h4 style="color: #e91e63;">Welcome! ${user.firstName}</h4>
                <p>Thanks for joining Fashiofy.Please verify your email:</p>
                <a href="${verficationUrl}"target="_blank" style="color: #1a73e8;">
               <button style = "background-color: #1a73e8;padding:6px;border-radius: 4px;color:white; text-align:center;border:none;cursor:pointer;">Click here</button>
                </a>
                <p>This link will expire in 24 hours.</p>
            </div>
            `;

        const data = await sendEmail(user.email, "Verify Your Email - Fashiofy", htmlMessage);
        return data;
    } catch (e) {
        logger.error("EMAIL VERIFICATION ERROR:", e);
    }
}
module.exports = { emailVerificationLink };