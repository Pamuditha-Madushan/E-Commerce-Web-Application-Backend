const joi = require("joi");

const searchKeywordValidationSchema = joi.object({
  keyword: joi.string().min(1).optional(),
});

module.exports = searchKeywordValidationSchema;
