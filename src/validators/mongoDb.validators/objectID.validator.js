const joi = require("joi");

const objectIdValidationSchema = joi.object({
  id: joi.string().length(24).hex().required(),
});

module.exports = objectIdValidationSchema;
