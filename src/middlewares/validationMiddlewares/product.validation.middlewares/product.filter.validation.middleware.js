const filterProductsValidationSchema = require("../../../validators/product.validators/product.filter.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const filterProductsValidation = async (req, res, next) => {
  const payload = {
    checked: req.body.checked,
    radio: req.body.radio,
  };

  const { error } = validate(filterProductsValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Product Filter Data: ${error.message}`)
      );

  next();
};

module.exports = filterProductsValidation;
