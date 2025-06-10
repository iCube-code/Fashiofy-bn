const router_v1 = require('express').Router();
const cors = require('cors');
const { login } = require('../Controllers/user_controller');
const { loginValidation } = require('../middlewares/AuthValidation');

router_v1.use(cors());

router_v1.post('/login',loginValidation, login)

module.exports = router_v1;