const slugify = require("slugify");
const categoryValidationSchema = require("../../../validators/category.validators/category.validator");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");

const categoryValidation = async (req, res, next) => {
  if (
    !req.body.name ||
    typeof req.body.name !== "string" ||
    req.body.name.trim === ""
  )
    return res
      .status(400)
      .json(
        errorFunction(
          true,
          "Category name is required in the request body or must be a valid string!"
        )
      );

  const payload = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };

  const { error } = validate(categoryValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Category Creating Data: ${error.message}`)
      );

  next();
};

module.exports = categoryValidation;
