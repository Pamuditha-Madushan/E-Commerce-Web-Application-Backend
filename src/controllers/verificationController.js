const crypto = require("crypto");
const Verification = require("../models/verification.model");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const logger = require("../utils/logger");

const OTP_EXPIRATION_TIME = 10 * 60 * 1000;

const generateOTPVerification = async () => {
  return crypto.randomInt(100000, 999999).toString();
};

const VerificationController = {
  sendVerificationEmail: async (user, email) => {
    try {
      let existingVerification = await Verification.findOne({
        userId: user._id,
        $or: [
          { verificationTokenExpiry: { $gt: Date.now() } },
          { verificationTokenExpiry: { $lte: Date.now() } },
        ],
      })
        .select("verificationTokenExpiry verificationToken")
        .exec();

      let verificationToken;

      if (existingVerification) {
        if (existingVerification.verificationTokenExpiry > Date.now()) {
          verificationToken = existingVerification.verificationToken;
          existingVerification.verificationTokenExpiry =
            Date.now() + OTP_EXPIRATION_TIME;

          await existingVerification.save();
          logger.info(
            "Existing verification token found and expiry time updated."
          );
        } else {
          verificationToken = await generateOTPVerification();
          existingVerification.verificationToken = verificationToken;
          existingVerification.verificationTokenExpiry =
            Date.now() + OTP_EXPIRATION_TIME;

          await existingVerification.save();
          logger.info(
            "Existing expired verification token found and updated it's expiry time and generated a new verification token."
          );
        }
      } else {
        verificationToken = await generateOTPVerification();
        const verificationTokenExpiry = Date.now() + OTP_EXPIRATION_TIME;

        const verificationResult = new Verification({
          userId: user._id,
          verificationToken,
          verificationTokenExpiry,
        });
        await verificationResult.save();
        logger.info("New verification document created.");
      }

      await sendVerificationEmail(email, verificationToken);
      logger.info(
        `[Verification Controller] Verification email process completed for user: ${user._id}`
      );
    } catch (error) {
      logger.error("Error in sendVerificationEmail controller: ", error);
      throw error;
    }
  },

  removeExpiredVerificationDocs: async () => {
    try {
      const result = await Verification.deleteMany({
        verificationTokenExpiry: { $lt: Date.now() },
      }).exec();
      logger.info(
        `Cron job: Removed ${result.deletedCount} expired verification tokens`
      );
    } catch (error) {
      logger.error("Error in removeExpiredVerifications cron job: ", error);
    }
  },
};

module.exports = VerificationController;
