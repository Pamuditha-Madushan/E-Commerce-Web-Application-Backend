const formidable = require("express-formidable");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadMiddleware = formidable({
  uploadDir: uploadsDir,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024,
  multiples: true,
});

module.exports = uploadMiddleware;
