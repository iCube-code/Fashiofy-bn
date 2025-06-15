const express = require("express");
const router = express.Router();
const cors = require('cors');
const { register } = require('../Controllers/userController');
const { login } = require('../Controllers/userController');
const { loginValidation } = require('../middlewares/AuthValidation');
const { getProductById } = require("../Controllers/productController");
const { getAllProducts } = require('../Controllers/productController');

router.use(cors());

router.post("/register",register);

router.post('/login',loginValidation, login)

router.get('/all', getAllProducts);

router.get("/:id", getProductById);

module.exports = router;