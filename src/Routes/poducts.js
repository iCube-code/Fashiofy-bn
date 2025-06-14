const router_v1 = require('express').Router();
const cors = require('cors');
const { getAllProducts } = require('../Controllers/product_controller');

router_v1.use(cors());

//getting all products
router_v1.get('/all', getAllProducts);

module.exports = router_v1;

