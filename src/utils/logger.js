const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "Production" ? "info" : "debug",

  format: winston.format.combine(
    winston.format.timestamp({
      format: () =>
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
