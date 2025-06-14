const express = require("express");
const { getProductById } = require("../Controllers/product_controller");
const router = express.Router();
const { getAllProducts } = require('../Controllers/product_controller');


//getting all products
router.get('/all', getAllProducts);

router.get("/:id", getProductById);

module.exports = router;
