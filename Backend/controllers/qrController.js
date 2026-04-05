const QRCode = require("qrcode");
const qrModel = require("../models/qrModel");
const { upload, cloudinary } = require("../middleware/upload");
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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload buffer to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Upload failed" });
        }

        const fileUrl = result.secure_url; // ✅ PUBLIC URL

        const qrImage = await QRCode.toDataURL(fileUrl);

        await qrModel.createQR("file", fileUrl, qrImage);

        res.json({ qrCode: qrImage, fileUrl });
      }
    );

    result.end(req.file.buffer);

  } catch (err) {
    console.error(err);
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