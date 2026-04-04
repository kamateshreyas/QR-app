const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .png, .jpg

    // ✅ SAFE NAME (no spaces, no weird chars)
    const safeName = Date.now() + ext;

    cb(null, safeName);
  }
});

module.exports = multer({ storage });