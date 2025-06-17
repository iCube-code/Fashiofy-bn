const express = require("express");
const {
  forgotPassword,
  login,
  register,
  resetPassword,
} = require("../Controllers/user_controller");
const { loginValidation } = require("../middlewares/AuthValidation");

const authRouter = express.Router();

authRouter.post("/login", loginValidation, login);
authRouter.post("/register", register);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
