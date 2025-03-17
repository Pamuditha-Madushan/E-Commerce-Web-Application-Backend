import slugify from "slugify";
import errorFunction from "../../../utils/errorFunction";
import imageDataRead from "../../../utils/imageDataRead";

const productUpdateValidationSchema = require("../../../validators/product.validators/product.update.validator");
const validate = require("../../../utils/validate");

const productUpdateValidation = async (req, res, next) => {
  const {
    name,
    brand,
    description,
    price,
    category,
    quantity,
    reviews,
    rating,
    numReviews,
    countInStock,
    shipping,
    discountPercentage,
    discountVisible,
  } = req.fields;

  const { image } = req.files;

  const imageData = imageDataRead(image);

  const discount = {
    percentage: discountPercentage,
    visible: discountVisible,
  };

  if (name) req.fields.slug = slugify(name);

  req.fields.discount = discount;

  const payload = {
    pid: req.params.pid,
    ...req.fields,
    image: imageData,
  };

  req.fields.image = imageData;

  const { error } = validate(productUpdateValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Product Update Data: ${error.message}`)
      );

  if (reviews && Array.isArray(JSON.parse(reviews))) {
    const parsedReviews = JSON.parse(reviews);

    const reviewErrors = parsedReviews
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

module.exports = productUpdateValidation;
