const express = require("express");
const dotenv = require("dotenv");
const InitializeDB = require("./src/config/db");
const logger = require("./src/utils/logger");
const { InitializeLog } = require("./src/middleware/logMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());
app.use(InitializeLog);

app.use("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Everything is working as expected" });
});

app.listen(PORT, () => {
  try {
    logger.info(`Server is running on http://localhost:${PORT}`);
    InitializeDB();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
