const joi = require("joi");
const objectIdValidationSchema = require("../mongoDb.validators/objectID.validator");

const orderStatusUpdateValidationSchema = joi.object({
  orderId: objectIdValidationSchema.extract("id").required(),
  status: joi
    .string()
    .valid("Processing", "Shipped", "Delivered", "Cancel")
    .required(),
});

module.exports = orderStatusUpdateValidationSchema;
