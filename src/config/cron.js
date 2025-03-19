const cron = require("node-cron");
const VerificationController = require("../controllers/verificationController");
const logger = require("../utils/logger");
const { bucket } = require("./gcStorage");

cron.schedule("*/15 * * * *", async () => {
  logger.info("Running cron job to remove expired verification tokens.");
  try {
    await VerificationController.removeExpiredVerificationDocs();
  } catch (error) {
    logger.error(
      "Error while running cron job to remove expired verification tokens: ",
      error
    );
  }
});

cron.schedule("*/30 * * * *", async () => {
  logger.info("Running cron job to remove orphaned product image uploads.");
  try {
    const temp = process.env.GCS_TEMP_FOLDER_LOCATION;
    if (!temp) {
      logger.warn(
        "Temp folder is not set. Cannot perform orphaned image cleanup."
      );
      return;
    }
    const [files] = await bucket.getFiles({ prefix: temp + "/" });
    await Promise.all(
      files.map(async (file) => {
        try {
          await file.delete();
          logger.info(`Deleted orphaned image: ${file.name}`);
        } catch (err) {
          logger.error(`Error deleting orphaned image ${file.name}: `, err);
        }
      })
    );
    logger.info("Orphaned product image cleanup completed");
  } catch (error) {
    logger.error(
      "Error while running cron job to remove orphaned product image uploads: ",
      error
    );
  }
});

logger.info(
  "Cron job scheduled to [remove orphaned product images at every 30 minutes] & to [remove expired verification tokens every 15 minutes]."
);
