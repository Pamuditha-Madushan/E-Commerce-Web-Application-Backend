const joi = require("joi");
const categoryNameValidationSchema = require("./category.name.validator");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");

const categoryUpdateValidationSchema = joi.object({
  name: categoryNameValidationSchema.extract("name"),
  id: objectIdValidationSchema.extract("id"),
});

module.exports = categoryUpdateValidationSchema;
