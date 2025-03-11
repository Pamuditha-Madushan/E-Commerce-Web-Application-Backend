const mongoose = require("mongoose");
const logger = require("../utils/logger");

const gracefulShutdown = async (server) => {
  try {
    logger.warn("Starting graceful shutdown...");

    await mongoose.connection.close();
    logger.warn("MongoDB connection closed");

    server.close(() => {
      logger.warn("Server is closed");
      process.exit(1);
    });

    setTimeout(() => {
      logger.error("Forcefully exiting after timeout");
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error("Error during graceful shutdown: ", error);
    process.exit(1);
  }
};

module.exports = gracefulShutdown;
