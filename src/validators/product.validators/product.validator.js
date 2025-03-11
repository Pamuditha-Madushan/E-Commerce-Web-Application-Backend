const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");
const slugValidationSchema = require("../slug.validator");

const productReviewValidationSchema = joi.object({
  name: joi.string().min(3).required(),
  rating: joi.number().required(),
  comment: joi.string().min(2).required(),
  user: objectIdValidationSchema.required(),
});

const productValidationSchema = joi.object({
  name: joi.string().min(3).required(),
  brand: joi.string().min(3).required(),
  slug: slugValidationSchema.extract("slug"),
  description: joi.string().min(15).required(),
  price: joi.number().required(),
  category: objectIdValidationSchema.required(),
  quantity: joi.number().required(),
  reviews: joi.array().items(productReviewValidationSchema).optional(),
  rating: joi.number().default(0),
  numReviews: joi.number().default(0),
  countInStock: joi.number().default(0),
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

module.exports = { productValidationSchema, productReviewValidationSchema };
