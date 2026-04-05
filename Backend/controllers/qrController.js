const QRCode = require("qrcode");
const qrModel = require("../models/qrModel");

// ✅ Generate QR (text/url)
exports.generateQR = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // ✅ NO FILE SYSTEM
    const qr = await QRCode.toDataURL(text);

    res.json({ qr });
  } catch (err) {
    console.error("QR ERROR:", err); // 🔥 will show in Render logs
    res.status(500).json({ error: "QR generation failed" });
  }
};

// ✅ Upload file + QR
exports.uploadFileQR = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = req.file.path || req.file.url;
    console.log("FILE URL:", fileUrl);

    const qrImage = await QRCode.toDataURL(fileUrl);

    await qrModel.createQR("file", fileUrl, qrImage);

    res.json({ qrCode: qrImage, fileUrl });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};

// ✅ Get history
exports.getAllQR = async (req, res) => {
  try {
    const data = await qrModel.getAllQR();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};