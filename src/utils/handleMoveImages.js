const storageService = require("../services/storageService");

const handleMoveImages = async (files, destination) => {
  const finalImages = [];

  if (Array.isArray(files)) {
    for (const file of files) {
      try {
        const newUrl = await storageService.moveFile(
          file.publicId,
          destination
        );
        file.url = newUrl;
        finalImages.push(file);
      } catch (moveError) {
        logger.error(`Error moving file ${file.publicId}: `, moveError);
        throw moveError;
      }
    }
  } else if (typeof files === "object" && files !== null) {
    try {
      const newUrl = await storageService.moveFile(files.publicId, destination);
      files.url = newUrl;
      finalImages.push(files);
    } catch (moveError) {
      logger.error(`Error moving file ${file.publicId}: `, moveError);
      throw moveError;
    }
  } else {
    throw new Error(
      "Invalid file format. Expected an array or a single file object."
    );
  }
  return finalImages;
};

module.exports = handleMoveImages;
