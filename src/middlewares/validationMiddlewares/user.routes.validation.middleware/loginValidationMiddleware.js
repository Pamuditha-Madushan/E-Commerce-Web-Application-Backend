const loginValidationSchema = require("../../../validators/user.validators/loginValidator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const loginValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = validate(loginValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(errorFunction(true, `Error in Login Data: ${error.message}`));
  next();
};

module.exports = loginValidation;
