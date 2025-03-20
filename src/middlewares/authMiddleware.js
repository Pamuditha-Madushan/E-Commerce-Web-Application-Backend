const JWT = require("jsonwebtoken");
const User = require("../models/userModel.js");
const errorFunction = require("../utils/errorFunction.js");
const logger = require("../utils/logger.js");

exports.requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer "))
      return next(new Error("Authorization header is missing or malformed!"));

    const token = authHeader.split(" ")[1];
    if (!token) return next(new Error("Token is missing or invalid format!"));

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return next(new Error("Invalid or malformed token!"));

    if (error.name === "TokenExpiredError")
      return next(new Error("TokeToken has expired!"));

    return next(error);
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean(true);

    if (user.role !== 1)
      return res.status(401).json(errorFunction(true, "UnAuthorized Access"));

    next();
  } catch (error) {
    logger.error("Error in admin middleware. ", error);
    return res
      .status(401)
      .json(errorFunction(true, "Error in admin middleware"));
  }
};
