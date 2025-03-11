const errorFunction = require("../utils/errorFunction");

const defaultController = async (req, res, next) => {
  res
    .status(200)
    .json(
      errorFunction(false, "Home Page", "Welcome from Liberty E-Commerce...")
    );
};

module.exports = defaultController;
