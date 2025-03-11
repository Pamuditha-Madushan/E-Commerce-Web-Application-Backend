const userValidationSchema = require("../../../validators/user.validators/userValidator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const userValidation = async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber,
    address: req.body.address,
    answer: req.body.answer,
    role: req.body.role,
  };

  const { error } = validate(userValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in User Registration Data: ${error.message}`)
      );
  next();
};

module.exports = userValidation;
