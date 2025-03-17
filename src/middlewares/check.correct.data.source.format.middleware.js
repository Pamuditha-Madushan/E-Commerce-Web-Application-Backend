const errorFunction = require("../utils/errorFunction");

const checkCorrectFormat = async (req, res, next) => {
  if (req.is("multipart/form-data")) {
    return next();
  }

  if (!req.fields || Object.keys(req.fields).length === 0)
    return res
      .status(400)
      .json(
        errorFunction(
          true,
          "Required product data not found in request fields. Please send data in the form fields!"
        )
      );

  return next();
};

module.exports = checkCorrectFormat;
