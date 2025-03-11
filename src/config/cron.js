const cron = require("node-cron");
const VerificationController = require("../controllers/verificationController");
const logger = require("../utils/logger");

cron.schedule("*/15 * * * *", async () => {
  logger.info("Running cron job to remove expired verification tokens.");
  try {
    await VerificationController.removeExpiredVerificationDocs();
  } catch (error) {
    logger.error("Error while running cron job: ", error);
  }
});

logger.info(
  "Cron job scheduled to remove expired verification tokens every 15 minutes."
);
