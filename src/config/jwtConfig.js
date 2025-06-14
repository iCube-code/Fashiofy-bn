const crypto = require('crypto');

//Generate a random secretKey

const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = { secretKey };