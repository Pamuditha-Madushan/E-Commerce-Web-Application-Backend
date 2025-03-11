const joi = require("joi");

const userValidationSchema = joi
  .object({
    name: joi.string().min(3).max(30).trim(true).required(),
    email: joi.string().email().trim(true).required(),
    password: joi.string().min(8).trim(true).when("googleId", {
      is: joi.exist(),
      then: joi.forbidden(),
      otherwise: joi.required(),
    }),
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^(?:7|0|\+94)[0-9]{9}$/)
      .required(),
    address: joi.object().required(),
    answer: joi.string().required(),
    role: joi.number().default(0),
    googleId: joi.string().optional(),
    googleProfile: joi.object().optional(),
  })
  .xor("googleId", "password");

module.exports = userValidationSchema;
