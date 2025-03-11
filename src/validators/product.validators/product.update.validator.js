const joi = require("joi");
const slugValidationSchema = require("../slug.validator");

const productUpdateValidationSchema = joi.object({
  name: joi.string().min(3).optional(),
  slug: slugValidationSchema.extract("slug"),
  description: joi.string().min(15).optional(),
  price: joi.number().optional(),
  category: joi.string().length(24).hex().optional(),
  quantity: joi.number().optional(),
  image: joi
    .object({
      data: joi.binary(),
      contentType: joi.string().optional().valid("image/jpeg", "image/png"),
    })
    .optional()
    .custom((value, helpers) => {
      if (value && value.data && Buffer.byteLength(value.data) > 1000000)
        return helpers.message("Image size must not exceed 1MB!");
      return value;
    }),
  shipping: joi.boolean(),
});

module.exports = productUpdateValidationSchema;
