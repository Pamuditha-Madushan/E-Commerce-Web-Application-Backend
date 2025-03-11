const {
  productValidationSchema,
  productReviewValidationSchema,
} = require("../../../validators/product.validators/product.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");
const slugify = require("slugify");

const productValidation = async (req, res, next) => {
  if (!req.fields.name || typeof req.fields.name !== "string")
    return res
      .status(400)
      .json(
        errorFunction(
          true,
          "Product name is required in the request fields or must be a valid string!"
        )
      );

  const payload = {
    name: req.fields.name,
    slug: slugify(req.fields.name),
    brand: req.fields.brand,
    description: req.fields.description,
    price: req.fields.price,
    category: req.fields.category,
    quantity: req.fields.quantity,
    reviews: req.fields.reviews,
    rating: req.fields.rating,
    numReviews: req.fields.numReviews,
    countInStock: req.fields.countInStock,
  };

  const { error } = validate(productValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Product creation Data: ${error.message}`)
      );

  if (req.fields.reviews && Array.isArray(req.fields.reviews)) {
    const reviewErrors = req.fields.reviews
      .map((review, index) => {
        const reviewPayload = {
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          user: review.user,
        };

        const { error: reviewError } = validate(
          productReviewValidationSchema,
          reviewPayload
        );
        return reviewError ? { index, message: reviewError.message } : null;
      })
      .filter(Boolean);

    if (reviewErrors.length > 0)
      return res
        .status(406)
        .json(
          errorFunction(
            true,
            `Error in Product Review Data: ${JSON.stringify(reviewErrors)}`
          )
        );
  }

  next();
};

module.exports = productValidation;
