const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  generateQR,
  uploadFileQR,
  getAllQR,
} = require("../controllers/qrController");

// ensure uploads folder exists
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/generate", generateQR);
router.post("/upload", upload.single("file"), uploadFileQR);
router.get("/history", getAllQR);

module.exports = router;  // ✅ VERY IMPORTANT