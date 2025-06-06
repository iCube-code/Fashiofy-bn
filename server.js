const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const InitializeDB = require("./src/config/db");
const app = express();
const PORT = process.env.PORT ?? 3000;


app.use("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Everything is working as expected" });
});

app.listen(PORT, () => {
  try {
    console.log(`Server is running on http://localhost:${PORT}`);
    InitializeDB();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
