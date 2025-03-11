const googleUserValidationSchema = require("../../validators/googleUserValidator");
const validate = require("../../utils/validate");
const errorFunction = require("../../utils/errorFunction");

const googleUserValidation = async (req, res, next) => {
  const payload = {
    mobileNumber: req.body.mobileNumber,
    address: req.body.address,
    answer: req.body.answer,
  };

  const { error } = validate(googleUserValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(errorFunction(true, `Error in Google User Data: ${error.message}`));

  next();
};

module.exports = googleUserValidation;
