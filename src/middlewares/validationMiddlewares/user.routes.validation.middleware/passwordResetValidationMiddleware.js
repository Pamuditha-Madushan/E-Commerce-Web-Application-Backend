const passwordResetValidationSchema = require("../../../validators/user.validators/passwordResetValidator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const passwordResetValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
    answer: req.body.answer,
    newPassword: req.body.newPassword,
  };

  const { error } = validate(passwordResetValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Password Reset Data: ${error.message}`)
      );

  next();
};

module.exports = passwordResetValidation;
