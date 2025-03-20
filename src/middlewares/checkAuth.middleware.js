const { requireSignIn } = require("../middlewares/authMiddleware");
const isLoggedIn = require("../middlewares/oauthMiddleware");
const errorFunction = require("../utils/errorFunction");

module.exports = function checkAuth(req, res, next) {
  requireSignIn(req, res, (err) => {
    if (!err) return next();
    else {
      isLoggedIn(req, res, (err) => {
        if (!err) return next();
        else return res.status(401).json(errorFunction(true, "Unauthorized!"));
      });
    }
  });
};
