const joi = require("joi");

const slugValidationSchema = joi.object({
  slug: joi
    .string()
    .pattern(/^[a-z0-9]+(?:[-'][a-z0-9]+)*$/)
    .required(),
});

module.exports = slugValidationSchema;
