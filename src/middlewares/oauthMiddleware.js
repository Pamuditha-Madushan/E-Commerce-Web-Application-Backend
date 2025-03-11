const errorFunction = require("../utils/errorFunction");

module.exports = function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated())
    res.status(401).json(errorFunction(true, "Unauthorized!"));

  return next();
};
