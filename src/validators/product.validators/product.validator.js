const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");
const slugValidationSchema = require("../slug.validator");

const productValidationSchema = joi.object({
  name: joi.string().min(3).required(),
  brand: joi.string().min(3).required(),
  slug: slugValidationSchema.extract("slug"),
  description: joi.string().min(15).required(),
  price: joi.number().required(),
  category: objectIdValidationSchema.extract("id").required(),
  quantity: joi.number().required(),
  reviews: joi.array().items(objectIdValidationSchema.extract("id")).optional(),
  rating: joi.number().default(0),
  numReviews: joi.number().default(0),
  countInStock: joi.number().default(0),
  discount: joi.object({
    percentage: joi.number().min(0).max(50).default(0),
    visible: joi.boolean().default(false),
  }),
  images: joi.array().items(
    joi
      .object({
        url: joi.string().required(),
        publicId: joi.string().required(),
      })
      .custom((value, helpers) => {
        if (value && value.data) {
          const fileSize = Buffer.byteLength(value.data);
          if (fileSize > 5000000)
            return helpers.message("Image size must not exceed 5MB!");
        }
        return value;
      })
  ),
  shipping: joi.boolean(),
});

module.exports = productValidationSchema;
