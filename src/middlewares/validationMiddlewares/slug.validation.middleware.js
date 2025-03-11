const slugValidationSchema = require("../../validators/slug.validator");
const validate = require("../../utils/validate");
const errorFunction = require("../../utils/errorFunction");

const slugValidation = async (req, res, next) => {
  const payload = {
    slug: req.params.slug,
  };

  const { error } = validate(slugValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Category slug [params] Data: ${error.message}`
        )
      );

  next();
};

module.exports = slugValidation;
