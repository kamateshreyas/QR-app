const QRCode = require("qrcode");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Generate QR for text
exports.generateQR = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const qrImage = await QRCode.toDataURL(text);

    res.json({ qr_code: qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR generation failed" });
  }
};

// Upload file → Cloudinary → QR
exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "qr_uploads" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        const fileUrl = result.secure_url;

        // Generate QR
        const qrImage = await QRCode.toDataURL(fileUrl);

        res.json({
          qr_code: qrImage,
          fileUrl,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
};