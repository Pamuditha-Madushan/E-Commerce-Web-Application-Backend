const productValidationSchema = require("../../../validators/product.validators/product.validator");
const slugify = require("slugify");
const validate = require("../../../utils/validate");
const errorFunction = require("../../../utils/errorFunction");
const handleUploadImages = require("../../../utils/handleUploadImages");
const logger = require("../../../utils/logger");
const storageService = require("../../../services/storageService");

const productValidation = async (req, res, next) => {
  const {
    name,
    brand,
    description,
    price,
    category,
    quantity,
    reviews,
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
    percentage: discountPercentage || 0,
    visible: discountVisible || false,
  };

  try {
    if (images) {
      tempUploadedImages = await handleUploadImages(images);
      req.fields.images = tempUploadedImages;
    } else req.fields.images = [];

    req.fields.slug = slugify(name);
    req.fields.discount = discount;

    const payload = {
      ...req.fields,
      images: tempUploadedImages,
    };

    const { error } = validate(productValidationSchema, payload);

    if (error) {
      await Promise.all(
        payload.images.map((img) => storageService.deleteFile(img.publicId))
      );
      return res
        .status(406)
        .json(
          errorFunction(
            true,
            `Error in Product creation Data: ${error.message}`
          )
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

module.exports = productValidation;
