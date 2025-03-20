const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose.set("strictQuery", false);

const dbURI = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.MONGODB_PASSWORD
);

const connectDB = async () => {
  if (!dbURI) {
    logger.error("MONGODB_URI is not defined in the environment variables");
    process.exit(1);
  }

  try {
    const mongooseConnection = await mongoose.connect(dbURI);
    logger.info(
      `Connected to the MongoDB Atlas: ${mongooseConnection.connection.host}`
    );
  } catch (error) {
    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ENOTFOUND")
    )
      logger.error(
        "No internet connection or MongoDB Atlas is unreachable. Please check your network connection."
      );
    else logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
