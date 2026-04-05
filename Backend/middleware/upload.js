const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.deoeuejmo,
  api_key: process.env.871368372698848,
  api_secret: process.env.8U1t-YjS8gCkYZTL07ITBx1oDsA,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "qr-files",
    resource_type: "auto", // supports image, video, pdf, audio
  },
});

module.exports = multer({ storage });