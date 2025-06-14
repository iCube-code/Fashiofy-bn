const router_v1 = require('express').Router();
const cors = require('cors');
const { register } = require('../Controllers/user_controller');

router_v1.use(cors());

router_v1.post("/register",register);


module.exports = router_v1;