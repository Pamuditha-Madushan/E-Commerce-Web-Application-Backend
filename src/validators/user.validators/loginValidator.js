const joi = require("joi");
const userValidationSchema = require("../user.validators/userValidator");

const loginValidationSchema = joi.object({
  email: userValidationSchema.extract("email").required(),
  password: userValidationSchema.extract("password").required(),
});

module.exports = loginValidationSchema;
