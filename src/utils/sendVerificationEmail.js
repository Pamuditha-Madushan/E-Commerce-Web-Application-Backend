const transporter = require("../config/nodemailer");
const { promisify } = require("util");
const logger = require("../utils/logger");
const getEmailTemplate = require("./emailTemplate");

const sendMail = promisify(transporter.sendMail.bind(transporter));

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your email address",
      html: getEmailTemplate(verificationToken),
    };

    await sendMail(mailOptions);
    logger.info(
      `[Email Utility] Verification email sent successfully to: ${email}`
    );
  } catch (error) {
    logger.error("Error in sendVerificationEmail utility due to: ", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
