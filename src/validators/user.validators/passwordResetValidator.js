const joi = require("joi");

const passwordResetValidationSchema = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
  answer: joi.string().required(),
  newPassword: joi.string().min(8).trim(true).required(),
});

module.exports = passwordResetValidationSchema;
