const categoryUpdateValidationSchema = require("../../../validators/category.validators/category.update.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const categoryUpdateValidation = async (req, res, next) => {
  const payload = {
    name: req.body.name,
    id: req.params.id,
  };

  const { error } = validate(categoryUpdateValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Category name Data: ${error.message}`)
      );

  next();
};

module.exports = categoryUpdateValidation;
