const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");
const slugValidationSchema = require("../slug.validator");

const productUpdateValidationSchema = joi.object({
  pid: objectIdValidationSchema.extract("id").required(),
  name: joi.string().min(3).optional(),
  slug: slugValidationSchema.extract("slug").optional(),
  brand: joi.string().min(3).optional(),
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
  images: joi
    .array()
    .items(
      joi
        .object({
          url: joi.string(),
          publicId: joi.string(),
        })
        .custom((value, helpers) => {
          if (value && value.data) {
            const fileSize = Buffer.byteLength(value.data);
            if (fileSize > 5000000)
              return helpers.message("Image size must not exceed 5MB!");
          }
          return value;
        })
    )
    .optional(),
  shipping: joi.boolean().optional(),
});

module.exports = productUpdateValidationSchema;
