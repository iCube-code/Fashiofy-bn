const express = require("express");
const { getProductById } = require("../Controllers/product_controller");
const router = express.Router();

router.get("/:id", getProductById);

module.exports = router;
