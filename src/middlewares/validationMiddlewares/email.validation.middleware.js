const emailValidationSchema = require("../../validators/email.validator");
const validate = require("../../utils/validate");
const errorFunction = require("../../utils/errorFunction");

const emailValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
  };

  const { error } = validate(emailValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(errorFunction(true, `Error in Email Data: ${error.message}`));

  next();
};

module.exports = emailValidation;
