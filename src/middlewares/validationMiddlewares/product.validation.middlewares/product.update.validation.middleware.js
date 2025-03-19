const slugify = require("slugify");
const errorFunction = require("../../../utils/errorFunction");
const handleUploadImages = require("../../../utils/handleUploadImages");
const productUpdateValidationSchema = require("../../../validators/product.validators/product.update.validator");
const validate = require("../../../utils/validate");
const logger = require("../../../utils/logger");

const productUpdateValidation = async (req, res, next) => {
  const {
    name,
    brand,
    description,
    price,
    category,
    quantity,
    rating,
    numReviews,
    countInStock,
    shipping,
    discountPercentage,
    discountVisible,
  } = req.fields;

  const { images } = req.files;
  let tempUploadedImages = [];

  const discount = {
    percentage: discountPercentage,
    visible: discountVisible,
  };

  try {
    if (images) {
      tempUploadedImages = await handleUploadImages(images);
      req.fields.images = tempUploadedImages;
    } else req.fields.images = [];

    if (name) req.fields.slug = slugify(name);

    req.fields.discount = discount;

    const payload = {
      pid: req.params.pid,
      ...req.fields,
    };

    const { error } = validate(productUpdateValidationSchema, payload);

    if (error) {
      await Promise.all(
        payload.images.map((img) => storageService.deleteFile(img.publicId))
      );
      return res
        .status(406)
        .json(
          errorFunction(true, `Error in Product Update Data: ${error.message}`)
        );
    }

    next();
  } catch (error) {
    logger.error("Error uploading images in validation middleware. ", error);
    return res
      .status(500)
      .json(errorFunction(true, `Error uploading images: ${error.message}`));
  }
};

module.exports = productUpdateValidation;
