const User = require("../models/userModel");

const isEmailExistsLean = async (email) => {
  const duplicate = await User.findOne({ email }).lean(true);
  return duplicate;
};

const isEmailExists = async (email) => {
  const duplicate = await User.findOne({ email }).select("+password").exec();
  return duplicate;
};

module.exports = {
  isEmailExistsLean,
  isEmailExists,
};
