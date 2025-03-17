const productIdValidationSchema = require("../../../validators/product.validators/productId.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const productIdParamsValidation = async (req, res, next) => {
  const payload = {
    pid: req.params.pid,
  };

  const { error } = validate(productIdValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Product id [params] Data: ${error.message}`
        )
      );

  next();
};

module.exports = productIdParamsValidation;
