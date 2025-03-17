const reviewValidationSchema = require("../../../validators/review.validators/review.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");
const User = require("../../../models/userModel");

const reviewValidation = async (req, res, next) => {
  const user = req.user._id;

  const result = await User.findOne({ _id: user }).exec();
  if (!result)
    return res
      .status(404)
      .json(errorFunction(true, "Signed in user is not found in the db!"));

  const name = result.name;

  req.body.name = name;
  req.body.user = user;

  const payload = {
    name,
    rating: req.body.rating,
    comment: req.body.comment,
    user,
    product: req.body.product,
  };

  const { error } = validate(reviewValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error While Adding Review Data: ${error.message}`)
      );

  next();
};

module.exports = reviewValidation;
