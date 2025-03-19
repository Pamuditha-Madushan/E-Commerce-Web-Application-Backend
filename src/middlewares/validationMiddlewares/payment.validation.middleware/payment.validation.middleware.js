const paymentValidationSchema = require("../../../validators/payment.validators/payment.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const paymentValidation = async (req, res, next) => {
  const payload = {
    nonce: req.body.nonce,
    cart: req.body.cart,
  };

  const { error } = validate(paymentValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Payment [controller] Data: ${error.message}`
        )
      );

  next();
};

module.exports = paymentValidation;
