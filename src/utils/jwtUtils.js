const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');
function generateToken(user) {
  const payload = {
    id: user._id,
    userName: user.username ?? '',
    email: user.email,
    isActive: user.isActive,
    role: user.fk_role_id?.roleName ?? "User"
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60, algorithm: "HS256" });
}
module.exports = {
  generateToken,
};
