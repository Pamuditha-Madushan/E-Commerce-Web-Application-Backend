const userProfileUpdateValidationSchema = require("../../../validators/user.validators/userProfileUpdateValidator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const userProfileUpdateValidation = async (req, res, next) => {
  const payload = {
    name: req.body.name,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber,
    address: req.body.address,
  };

  const { error } = validate(userProfileUpdateValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(
          true,
          `Error in User Profile Update Data: ${error.message}`
        )
      );

  next();
};

module.exports = userProfileUpdateValidation;
