const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");

const paymentValidationSchema = joi.object({
  nonce: joi.string().required(),
  cart: joi.array().items(objectIdValidationSchema.extract("id")).required(),
});

module.exports = paymentValidationSchema;
