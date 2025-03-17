const joi = require("joi");
const userValidationSchema = require("../user.validators/userValidator");

const passwordResetValidationSchema = joi.object({
  email: userValidationSchema.extract("email").required(),
  password: userValidationSchema.extract("password").required(),
  answer: userValidationSchema.extract("answer").required(),
  newPassword: userValidationSchema.extract("password").required(),
});

module.exports = passwordResetValidationSchema;
