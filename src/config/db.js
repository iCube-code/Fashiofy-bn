const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function InitializeDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    logger.info("Connected to Database");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

module.exports = InitializeDB;
