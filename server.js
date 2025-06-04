const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const InitializeDB = require("./src/config/db");
dotenv.config();
const AuthRouter  = require('./src/Routes/AuthRouter');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);


app.get('/ping', (req,res)=>{
  res.send('welcome');
}) 

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
