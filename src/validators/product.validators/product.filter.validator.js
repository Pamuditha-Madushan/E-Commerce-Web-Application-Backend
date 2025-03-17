const joi = require("joi");

const filterProductsValidationSchema = joi.object({
  checked: joi.array().items(joi.string()).min(1).optional(),
  radio: joi.array().items(joi.number().min(0)).length(2).optional(),
});

module.exports = filterProductsValidationSchema;
