const express = require("express");
const router = express.Router();
const { loginValidation } = require("../middlewares/AuthValidation");
const {
  getProductById,
  getAllProducts,
  orderProduct,
  getOrders,
  addProduct,
  getProduct,
} = require("../Controllers/productController");
const { addToCart, getCartProducts } = require("../Controllers/cartController");
const {
  addToWishList,
  getWishList,
} = require("../Controllers/wishlistController");
const {
  register,
  forgotPassword,
  verifyEmail,
  login,
  resetPassword,
  validateOTP,
} = require("../Controllers/userController");

const auth = require("../middlewares/AuthMiddleware");
const { registerSeller } = require("../Controllers/sellerController");
const {
  upload,
  validateImageContent,
  handleUploadErrors,
} = require("../utils/multer");

// user

router.post("/user/account/new", register);

router.post("/user/account/login", loginValidation, login);

router.post("/user/account/login/verify", validateOTP);

router.post("/user/account/forgot-password", forgotPassword);

router.post("/user/account/reset-password", resetPassword);

router.post("/user/account/verify", auth, verifyEmail);

// products

router.get("/products/all", getAllProducts);

router.get("/products/:id", getProductById);

router.post("/products/cart/add", auth, addToCart);

router.post("/products/wishlist/add", auth, addToWishList);

router.post("/products/orders/add", auth, orderProduct);

router.get("/products/cart/fetch", auth, getCartProducts);

router.get("/products/orders/fetch", auth, getOrders);

router.get("/products/wishlist/fetch", auth, getWishList);

//Seller

router.post("/seller/account/new", registerSeller);
router.post(
  "/seller/product/add",
  auth,
  upload,
  validateImageContent,
  addProduct,
  handleUploadErrors
);
router.get("/products/seller/all",auth,getProduct);

module.exports = router;
