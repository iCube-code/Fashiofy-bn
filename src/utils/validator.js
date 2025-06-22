const Joi = require("joi");
const logger = require("./logger");

class Validator {
  validateEmail(email) {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          tlds: { allow: false },
          minDomainSegments: 2,
        })
        .required(),
    });

    try {
      const { error, value } = schema.validate({ email });

      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return "Not a Valid Email";
      }

      return value.email;
    } catch (error) {
      logger.error(
        `Unexpected error during email validation: ${error.message}`
      );
      return "Something went wrong";
    }
  }
}

module.exports = Validator;
