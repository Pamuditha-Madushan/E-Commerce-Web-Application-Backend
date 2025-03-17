const path = require("path");
const fs = require("fs");
const { bucket } = require("../config/gcStorage");
const logger = require("../utils/logger");

const TEMP_FOLDER_LOCATION = process.env.GCS_TEMP_FOLDER_LOCATION;

function getUploadRoute(identifier) {
  return TEMP_FOLDER_LOCATION
    ? `${TEMP_FOLDER_LOCATION}/${identifier}`
    : identifier;
}

class StorageService {
  async uploadFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("No file provided!"));
      }

      const validContentType = ["image/jpeg", "image/png"];
      if (!validContentType.includes(file.type))
        return reject(
          "Unsupported file type! Only 'JPEG' and 'PNG' are allowed."
        );

      const fileName = `${Date.now()}-ECA-${path.basename(file.path)}`;

      const fileUpload = bucket.file(getUploadRoute(fileName));

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.type,
        },
        resumable: false,
      });

      stream.on("error", (error) => {
        reject(error);
      });

      stream.on("finish", async () => {
        await fileUpload.makePublic();

        const publicUrl = `https://storage.googleapis.com/${
          bucket.name
        }/${getUploadRoute(fileName)}`;

        fs.unlink(file.path, (err) => {
          if (err) logger.error("Error deleting temporary file. ", err);
        });

        resolve({
          publicId: fileName,
          url: publicUrl,
        });
      });

      fs.createReadStream(file.path).pipe(stream);
    });
  }

  async moveFile(publicId, destination) {
    try {
      console.log(
        "Attempting to move file:",
        publicId,
        "to destination:",
        destination
      );

      const file = bucket.file(getUploadRoute(publicId));

      const newMoveRoute = destination
        ? `${destination}/${publicId}`
        : publicId;

      await file.move(newMoveRoute);

      const newPublicUrl = `https://storage.googleapis.com/${bucket.name}/${newMoveRoute}/`;
      logger.info(`File ${publicId} moved to ${newPublicUrl}`);
      return newPublicUrl;
    } catch (error) {
      logger.error(`Error moving file ${publicId}: `, error);
      throw error;
    }
  }

  async deleteFile(publicId) {
    try {
      await bucket.file(publicId).delete();
      return true;
    } catch (error) {
      logger.error("Error deleting file from the GCS: ", error);
      return false;
    }
  }
}

module.exports = new StorageService();
