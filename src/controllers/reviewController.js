const Review = require("../models/reviewModel");
const errorFunction = require("../utils/errorFunction");
const logger = require("../utils/logger");
const updateProductWithReview = require("../utils/productUtils");

const ReviewController = {
  addReview: async (req, res) => {
    try {
      const { name, rating, comment, user, product } = req.body;

      const existingReview = await Review.findOne({ user, product }).lean(true);

      if (existingReview)
        return res
          .status(403)
          .json(
            errorFunction(
              true,
              "Review by this user for this product is already exists!"
            )
          );

      const review = new Review({
        name,
        rating,
        comment,
        user,
        product,
      });

      const result = await review.save();

      await updateProductWithReview(result.product._id, result);

      res
        .status(201)
        .json(errorFunction(false, "Review added successfully.", review));
    } catch (error) {
      logger.error("Error while adding review. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to: ${error.message}`)
        );
    }
  },
};

module.exports = ReviewController;
