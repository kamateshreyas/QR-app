const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/upload");

const {
  generateQR,
  uploadFileQR,
  getHistory,
  getQRById
} = require("../controllers/qrController"); // ✅ FIXED IMPORT

// ✅ ORDER MATTERS (IMPORTANT)
router.get("/history", getHistory);   // FIRST
router.get("/:id", getQRById);        // THEN dynamic route

router.post("/generate", generateQR);
router.post("/upload", upload.single("file"), uploadFileQR);

module.exports = router;