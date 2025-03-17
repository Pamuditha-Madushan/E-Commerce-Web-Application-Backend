const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");
const slugValidationSchema = require("../slug.validator");

const productUpdateValidationSchema = joi.object({
  pid: objectIdValidationSchema.extract("id").required(),
  name: joi.string().min(3).optional(),
  slug: slugValidationSchema.extract("slug").optional(),
  description: joi.string().min(15).optional(),
  price: joi.number().optional(),
  category: objectIdValidationSchema.extract("id").optional(),
  quantity: joi.number().optional(),
  reviews: joi.array().items(objectIdValidationSchema.extract("id")).optional(),
  rating: joi.number().optional(),
  numReviews: joi.number().optional(),
  countInStock: joi.number().optional(),
  discount: joi.object({
    percentage: joi.number().min(0).max(50),
    visible: joi.boolean(),
  }),
  image: joi
    .object({
      data: joi.binary(),
      contentType: joi.string().optional().valid("image/jpeg", "image/png"),
    })
    .optional()
    .custom((value, helpers) => {
      if (value && value.data) {
        const fileSize = Buffer.byteLength(value.data);
        if (fileSize > 1000000)
          return helpers.message("Image size must not exceed 1MB!");
      }
      return value;
    }),
  shipping: joi.boolean().optional(),
});

module.exports = productUpdateValidationSchema;
