const joi = require("joi");
const categoryNameValidationSchema = require("./category.name.validator");
const categorySlugValidationSchema = require("../slug.validator");

const categoryValidationSchema = joi.object({
  name: categoryNameValidationSchema.extract("name"),
  slug: categorySlugValidationSchema.extract("slug"),
});

module.exports = categoryValidationSchema;
