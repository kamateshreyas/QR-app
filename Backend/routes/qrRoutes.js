const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  generateQR,
  uploadFileQR,
  getAllQR,
} = require("../controllers/qrController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/generate", generateQR);
router.post("/upload", upload.single("file"), uploadFileQR);
router.get("/history", getAllQR);

module.exports = router;