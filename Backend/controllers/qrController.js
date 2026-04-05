const archiver = require("archiver");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const QRCode = require("qrcode");
const { createQR } = require("../models/qrModel");

exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 📦 Create ZIP in memory
    const archive = archiver("zip", { zlib: { level: 9 } });

    const chunks = [];
    archive.on("data", chunk => chunks.push(chunk));

    archive.append(req.file.buffer, { name: req.file.originalname });
    archive.finalize();

    archive.on("end", async () => {
      const zipBuffer = Buffer.concat(chunks);

      // ☁️ Upload ZIP to Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "qr_uploads",
          resource_type: "raw" // 🔥 IMPORTANT for zip
        },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Upload failed" });
          }

          const fileUrl = result.secure_url;

          // Generate QR
          const qrImage = await QRCode.toDataURL(fileUrl);

          await createQR("zip", fileUrl, qrImage);

          res.json({
            qr_code: qrImage,
            fileUrl
          });
        }
      );

      streamifier.createReadStream(zipBuffer).pipe(stream);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zip conversion failed" });
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