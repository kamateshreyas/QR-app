const QRCode = require("qrcode");
const qrModel = require("../models/qrModel");

// Generate QR for text/url
exports.generateQR = async (req, res) => {
  try {
    const { type, content } = req.body;

    const qrImage = await QRCode.toDataURL(content);

    qrModel.createQR(
      { type, content, qr_code: qrImage },
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ qrCode: qrImage });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "QR generation failed" });
  }
};

// Upload file + QR
exports.uploadFileQR = async (req, res) => {
  try {
const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    const qrImage = await QRCode.toDataURL(fileUrl);

    qrModel.createQR(
      { type: "file", content: fileUrl, qr_code: qrImage },
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ qrCode: qrImage, fileUrl });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "File upload failed" });
  }
};

// Get history
exports.getAllQR = (req, res) => {
  qrModel.getAllQR((err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};