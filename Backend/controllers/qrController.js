const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const QRCode = require("qrcode");
const { createQR, getAllQR } = require("../models/qrModel");

exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "qr_uploads" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        const fileUrl = result.secure_url;

        // Generate QR
        const qrImage = await QRCode.toDataURL(fileUrl);

        // ✅ SAVE TO SUPABASE USING MODEL
        await createQR("file", fileUrl, qrImage);

        // Send response
        res.json({
          qr_code: qrImage,
          fileUrl,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.generateQR = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const qrImage = await QRCode.toDataURL(text);

    // ✅ SAVE TEXT QR
    await createQR("text", text, qrImage);

    res.json({ qr_code: qrImage });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR generation failed" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const data = await getAllQR();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};