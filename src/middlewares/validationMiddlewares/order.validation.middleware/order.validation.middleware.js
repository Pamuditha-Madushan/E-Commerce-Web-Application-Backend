const orderStatusUpdateValidationSchema = require("../../../validators/order.validators/order.status.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const orderStatusUpdateValidation = async (req, res, next) => {
  const payload = {
    orderId: req.params.orderId,
    status: req.body.status,
  };

  const { error } = validate(orderStatusUpdateValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Order Status Update Data: ${error.message}`
        )
      );

  next();
};

module.exports = orderStatusUpdateValidation;
