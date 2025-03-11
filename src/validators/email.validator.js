const joi = require("joi");

const emailValidationSchema = joi.object({
  email: joi.string().email().trim(true).required(),
});

module.exports = emailValidationSchema;
