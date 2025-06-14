const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const InitializeDB = require("./src/config/db");
dotenv.config();

const registerRouter_v1 = require('./src/Routes/signup');
const loginRouter_v1 = require('./src/Routes/login');
const globalErrorHandler = require("./src/middlewares/globalErrorHandler");

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use('/api', loginRouter_v1);


app.use("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Everything is working as expected" });
});

// //Root Endpoint
// app.get("/", (req,res) => {
//   res.json({message: "Hello from Fashiofy server!"});
// })

// Middlewares
app.use(express.json()); // parse the incomming req into JSON formate

// other Endpoints
app.use("/api/user", registerRouter_v1);

// Global error handler
app.use(globalErrorHandler);


app.listen(PORT, () => {
  try {
    console.log(`Server is running on http://localhost:${PORT}`);
    InitializeDB();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
