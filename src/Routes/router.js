const express = require("express");
const router = express.Router();
const { login } = require("../Controllers/userController");
const { loginValidation } = require("../middlewares/AuthValidation");
const { getProductById } = require("../Controllers/productController");
const { getAllProducts } = require("../Controllers/productController");
const { resetPassword } = require("../Controllers/userController");
const { addToCart } = require("../Controllers/cartController");
const { addToWishList } = require("../Controllers/wishlistController");
const { register,forgotPassword,verifyEmail } = require("../Controllers/userController");

const auth = require("../middlewares/AuthMiddleware");

router.post("/user/account/new", register);
router.post("/user/login", loginValidation, login);
router.get("/products/all", getAllProducts);
router.post("/user/account/forgot-password", forgotPassword);
router.get("/:id", getProductById);
router.post("/user/account/reset-password", resetPassword);

router.get("/products/:id", getProductById);

router.post("/products/cart/add", auth, addToCart);

router.post("/products/wishlist/add", auth, addToWishList);

router.post("/user/account/verify",auth, verifyEmail);

module.exports = router;
