const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/upload");
const { generateQR, uploadFileQR } = require("../controllers/qrController");

router.post("/generate", generateQR);
router.post("/upload", upload.single("file"), uploadFileQR);

module.exports = router;