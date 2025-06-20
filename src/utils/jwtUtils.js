const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');
function generateToken(user) {
  const payload = {
    id: user._id,
    userName: user.firstName + user.lastName ?? '',
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
}
module.exports = {
  generateToken,
};
