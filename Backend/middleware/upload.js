const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

// store file temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// function to upload to cloudinary manually
const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "qr_uploads",
  });
};

module.exports = { upload, uploadToCloudinary };