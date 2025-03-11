const joi = require("joi");

const userProfileUpdateValidationSchema = joi.object({
  name: joi.string().min(3).max(30).trim(true).optional(),
  password: joi.string().min(8).trim(true).optional(),
  mobileNumber: joi
    .string()
    .length(10)
    .pattern(/^(?:7|0|\+94)[0-9]{9}$/)
    .optional(),
  address: joi.object().optional(),
});

module.exports = userProfileUpdateValidationSchema;
