const joi = require("joi");

const googleUserValidationSchema = joi.object({
  mobileNumber: joi
    .string()
    .length(10)
    .pattern(/^(?:7|0|\+94)[0-9]{9}$/)
    .required(),
  address: joi.object().required(),
  answer: joi.string().required(),
});

module.exports = googleUserValidationSchema;
