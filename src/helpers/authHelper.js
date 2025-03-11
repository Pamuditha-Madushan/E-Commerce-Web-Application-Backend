const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const securePassword = async (password) => {
  if (!password) {
    logger.error("Password is undefined or null");
    throw new Error("Password is required.");
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error(error);
    throw new Error("Error hashing the password");
  }
};

const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    logger.error("Password or Hashed Password is undefined or null");
    throw new Error("Both password and hash are required");
  }
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  securePassword,
  comparePassword,
};
