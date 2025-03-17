const storageService = require("../services/storageService");

const handleUploadImages = async (files) => {
  const result = [];

  if (Array.isArray(files)) {
    for (const file of files) {
      try {
        const uploadedImage = await storageService.uploadFile(file);
        result.push(uploadedImage);
      } catch (uploadError) {
        logger.error("Error uploading file: ", uploadError);
        throw uploadError;
      }
    }
  } else if (typeof files === "object" && files !== null) {
    try {
      const uploadedImage = await storageService.uploadFile(files);
      result.push(uploadedImage);
    } catch (uploadError) {
      logger.error("Error uploading files: ", uploadError);
      throw uploadError;
    }
  } else {
    throw new Error(
      "Invalid file format. Expected an array or a single file object."
    );
  }
  return result;
};

module.exports = handleUploadImages;
