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
    logger.error(error);
    process.exit(1);
  }
};

// mongoose.connection.on("Disconnected", () => {
//   logger.info(`mongodb is disconnected`);
// });

// mongoose.connection.on("connected", () => {
//   logger.info(`mongodb is connected`);
// });

module.exports = connectDB;
