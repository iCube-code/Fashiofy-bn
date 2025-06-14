function forgotPasswordTemplate(userFullName, forgotPasswordLink) {
  return `
    <p>Hi ${userFullName},</p>
    <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
    <p><a href="${forgotPasswordLink}" style="color: #1a73e8;">Reset Password</a></p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>Fashiofy Support Team</p>
  `;
}

module.exports = { forgotPasswordTemplate };
