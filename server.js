const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const InitializeDB = require("./src/v1/config/db");
dotenv.config();
const loginRouter_v1 = require('./src/v1/Routes/login');

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use('/api', loginRouter_v1);


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
