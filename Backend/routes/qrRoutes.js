const express = require("express");
const router = express.Router();

// ✅ Import Cloudinary upload middleware (VERY IMPORTANT)
const upload = require("../middleware/upload");

// ✅ Import controller functions
const {
  generateQR,
  uploadFileQR,
  getAllQR
} = require("../controllers/qrController");

// ✅ TEXT / URL QR
router.post("/generate", generateQR);

// ✅ FILE QR (uses Cloudinary)
router.post("/upload", upload.single("file"), uploadFileQR);

// ✅ HISTORY
router.get("/history", getAllQR);

module.exports = router;