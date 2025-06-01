const mongoose = require("mongoose");

async function InitializeDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = InitializeDB;
