const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const { generateQR, uploadFileQR } = require("../controllers/qrController");
const { getHistory } = require("../controllers/qrController");
const { getQRById } = require("../models/qrModel");

router.get("/:id", async (req, res) => {
  try {
    const data = await getQRById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});
router.get("/history", getHistory);
router.post("/generate", generateQR);
router.post("/upload", upload.single("file"), uploadFileQR);

module.exports = router;