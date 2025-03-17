const joi = require("joi");
const objectIdValidationSchema = require("../../validators/mongoDb.validators/objectID.validator");

const productIdValidationSchema = joi.object({
  pid: objectIdValidationSchema.extract("id"),
});

module.exports = productIdValidationSchema;
