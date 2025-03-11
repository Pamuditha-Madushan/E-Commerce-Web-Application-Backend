const joi = require("joi");

const emailVerificationSchema = joi.object({
  email: joi.string().email().trim(true).required(),
  otp: joi
    .string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .custom((value, helpers) => {
      const otpValue = parseInt(value, 10);
      if (otpValue < 100000 || otpValue > 999999)
        return helpers.error("any.invalid");
      return value;
    }, "Custom Range Validation")
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits long!",
      "string.pattern.base": "OTP must contain only numeric digits!",
      "any.required": "OTP is required!.",
      "any.invalid": "OTP isn't between the OTP value range!",
    }),
});

module.exports = emailVerificationSchema;
