const searchKeywordValidationSchema = require("../../validators/search.keyword.validator");
const validate = require("../../utils/validate");
const errorFunction = require("../../utils/errorFunction");

const searchKeywordValidation = async (req, res, next) => {
  const payload = {
    keyword: req.query.search,
  };

  const { error } = validate(searchKeywordValidationSchema, payload);

  if (error)
    return res
      .status(406)
      .json(
        errorFunction(true, `Error in Search Keyword [query]: ${error.message}`)
      );

  next();
};

module.exports = searchKeywordValidation;
