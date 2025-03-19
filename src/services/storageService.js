const path = require("path");
const fs = require("fs");
const { bucket } = require("../config/gcStorage");
const logger = require("../utils/logger");

const TEMP = process.env.GCS_TEMP_FOLDER_LOCATION;

function getUploadRoute(identifier) {
  return TEMP ? `${TEMP}/${identifier}` : identifier;
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
      const file = bucket.file(getUploadRoute(publicId));

      const newMoveRoute = destination
        ? `${destination}/${publicId}`
        : publicId;

      await file.move(newMoveRoute);

      const newPublicUrl = `https://storage.googleapis.com/${bucket.name}/${newMoveRoute}`;
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
      logger.error("Error deleting file from the Cloud storage: ", error);
      return false;
    }
  }

  compareFile(existingFiles, newFiles) {
    const filesToRemove = existingFiles
      ? existingFiles.filter(
          (file) => !newFiles.find((newFile) => newFile.url === file.url)
        )
      : [];
    const filesToUpload = newFiles
      ? newFiles.filter(
          (file) =>
            !existingFiles.find((existingFile) => existingFile.url === file.url)
        )
      : [];

    return { filesToRemove, filesToUpload };
  }
}

module.exports = new StorageService();
