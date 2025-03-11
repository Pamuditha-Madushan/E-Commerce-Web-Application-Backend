const joi = require("joi");

const categoryNameValidationSchema = joi.object({
  name: joi.string().min(2).required(),
});

module.exports = categoryNameValidationSchema;
