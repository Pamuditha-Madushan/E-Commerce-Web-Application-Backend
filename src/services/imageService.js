const { bucket } = require("../config/gcStorage");

const DESTINATION = process.env.GCS_DESTINATION_FOLDER_PATH;

async function getImageData(imageUrl) {
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  const fileExtension = filename
    .substring(filename.lastIndexOf(".") + 1)
    .toLowerCase();

  let contentType;
  if (fileExtension === "jpg" || fileExtension === "jpeg")
    contentType = "image/jpeg";
  else if (fileExtension === "png") contentType = "image/png";
  else
    throw new Error("Unsupported image format. Only JPEG and PNG are allowed.");

  const file = bucket.file(`${DESTINATION}/${filename}`);

  const [exists] = await file.exists();
  if (!exists) throw new Error("Image not found in the storage.");

  const [imageBuffer] = await file.download();

  return { imageBuffer, contentType };
}

module.exports = getImageData;
