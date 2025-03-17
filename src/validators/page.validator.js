const joi = require("joi");

const pageValidationSchema = joi.object({
  page: joi.number().min(1).required(),
});

module.exports = pageValidationSchema;
