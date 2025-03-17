const express = require("express");
const ReviewController = require("../controllers/reviewController");
const reviewValidation = require("../middlewares/validationMiddlewares/review.validation.middlewares/review.validation.middleware");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/add",
  requireSignIn,
  reviewValidation,
  ReviewController.addReview
);

module.exports = router;
