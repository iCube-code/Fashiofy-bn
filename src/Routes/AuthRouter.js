const { login } = require('../Controllers/AuthController');

const { loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login',loginValidation, login)

module.exports = router;