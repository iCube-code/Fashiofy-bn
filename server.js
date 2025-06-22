const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const InitializeDB = require("./src/config/db");
const logger = require("./src/utils/logger");
const { InitializeLog } = require("./src/middlewares/logMiddleware");

dotenv.config();

const globalErrorHandler = require("./src/middlewares/globalErrorHandler");
const routes = require("./src/Routes/router");
const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use(InitializeLog);

app.use("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Everything is working as expected" });
});

// Global error handler
app.use(globalErrorHandler);

// Routes
app.use("/api/v1", routes);

app.listen(PORT, () => {
  try {
    logger.info(`Server is running on http://localhost:${PORT}`);
    InitializeDB();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
