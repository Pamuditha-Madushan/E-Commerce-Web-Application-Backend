const objectIdValidationSchema = require("../../../validators/mongoDb.validators/objectID.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const categoryIdParamsValidation = async (req, res, next) => {
  const payload = {
    id: req.params.id,
  };

  const { error } = validate(objectIdValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Category id [params] Data: ${error.message}`
        )
      );

  next();
};

module.exports = categoryIdParamsValidation;
