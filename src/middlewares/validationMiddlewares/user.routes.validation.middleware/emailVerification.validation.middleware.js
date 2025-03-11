const emailVerificationSchema = require("../../../validators/user.validators/emailVerification.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const emailVerificationValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    otp: req.body.otp,
  };

  const { error } = validate(emailVerificationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in Email Verification Data: ${error.message}`
        )
      );

  next();
};

module.exports = emailVerificationValidation;
