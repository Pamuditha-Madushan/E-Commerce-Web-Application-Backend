const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");

const reviewValidationSchema = joi.object({
  name: joi.string().min(3).required(),
  rating: joi.number().min(1).max(5).required(),
  comment: joi.string().min(2).required(),
  user: objectIdValidationSchema.extract("id").required(),
  product: objectIdValidationSchema.extract("id").required(),
});

module.exports = reviewValidationSchema;
