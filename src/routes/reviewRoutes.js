const express = require("express");
const ReviewController = require("../controllers/reviewController");
const reviewValidation = require("../middlewares/validationMiddlewares/review.validation.middlewares/review.validation.middleware");
const checkAuth = require("../middlewares/checkAuth.middleware");

const router = express.Router();

router.post("/add", checkAuth, reviewValidation, ReviewController.addReview);

module.exports = router;
