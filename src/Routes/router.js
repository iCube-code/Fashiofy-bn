const express = require("express");
const router = express.Router();
const cors = require("cors");
const { register, forgotPassword } = require("../Controllers/userController");
const { login } = require("../Controllers/userController");
const { loginValidation } = require("../middlewares/AuthValidation");
const { getProductById } = require("../Controllers/productController");
const { getAllProducts } = require("../Controllers/productController");
const { resetPassword } = require("../Controllers/userController");
const { addToCart } = require("../Controllers/cartController");
const auth = require("../middlewares/AuthMiddleware");

router.use(cors());

router.post("/user/account/new", register);

router.post("/user/login", loginValidation, login);

router.get("/products/all", getAllProducts);

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get("/:id", getProductById);

router.post("/user/account/reset-password", resetPassword);

router.get("/products/:id", getProductById);

router.post("/products/cart/add", auth, addToCart);

module.exports = router;
