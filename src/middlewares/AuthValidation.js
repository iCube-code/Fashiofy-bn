const joi = require('joi');

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(`error in login validation ${error}`);
        return res.status(400)
            .json({ message: "Bad Request" })
    }
    next();
}
module.exports = {
    loginValidation
}