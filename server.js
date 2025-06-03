const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const InitializeDB = require("./src/config/db");
const sendEmail = require("./src/utils/mailer");
const { frontendUrl } = require("./src/utils/constants");
const app = express();
const PORT = process.env.PORT;


// Sample route for Email for Greeting User

app.get("/greet", async (req, res) => {
  await sendEmail({
    recipient: "",    //  add recipient email address here
    subject: "Welcome to Fashiofy",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333333;">👋 Welcome to <span">Fashiofy</span>, User!</h1>
        <p style="font-size: 16px; color: #555;">
          Thank you for visiting <strong>Fashiofy</strong> – your ultimate destination for trendsetting fashion and style inspiration.
        </p>
        <p style="font-size: 16px; color: #555;">
          We're excited to have you here. Explore our latest collections, enjoy exclusive offers, and stay ahead in fashion.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href=${frontendUrl} style="background-color: #f7f7f7; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            🛍️ Start Shopping
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you have any questions, just reply to this email — we're always happy to help.
        </p>
        <p style="font-size: 14px; color: #999;">Cheers, <br> The Fashiofy Team</p>
      </div>
    </div>
`,
  });
  res.status(200).send("Welcome to Fashiofy");
});

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
