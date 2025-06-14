const logger = require("../utils/logger");

function InitializeLog(req, res, next) {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    message: "Incoming request",
  });
  next();
}

module.exports = { InitializeLog };
