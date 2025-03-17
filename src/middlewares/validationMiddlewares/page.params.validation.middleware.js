const pageValidationSchema = require("../../validators/page.validator");
const validate = require("../../utils/validate");
const errorFunction = require("../../utils/errorFunction");

const pageValidation = async (req, res, next) => {
  const payload = {
    page: req.params.page,
  };

  const { error } = validate(pageValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in page [param] data: ${error.message}`)
      );

  next();
};

module.exports = pageValidation;
