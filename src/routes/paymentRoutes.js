const express = require("express");
const PaymentController = require("../controllers/paymentController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const paymentValidation = require("../middlewares/validationMiddlewares/payment.validation.middleware/payment.validation.middleware");

const router = express.Router();

router.get("/brain-tree/token", PaymentController.brainTreeTokenController);

router.post(
  "/brain-tree/payment",
  requireSignIn,
  paymentValidation,
  PaymentController.brainTreePaymentController
);

module.exports = router;
