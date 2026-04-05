const archiver = require("archiver");
const unzipper = require("unzipper");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const QRCode = require("qrcode");
const { createQR } = require("../models/qrModel");

exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let uploadedFiles = [];

    const stream = streamifier.createReadStream(req.file.buffer);

    stream
      .pipe(unzipper.Parse())
      .on("entry", async (entry) => {
        const fileBuffer = await entry.buffer();

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "qr_files",
            resource_type: "auto"
          },
          (err, result) => {
            if (!err) {
              uploadedFiles.push(result.secure_url);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      })
      .on("finish", async () => {
        // Create viewer link
        const idData = await createQR("zip", "zip_upload", "", uploadedFiles);
        const id = idData[0].id;

        const viewerUrl = `https://qr-frontend.netlify.app/view.html?id=${id}`;

        const qrImage = await QRCode.toDataURL(viewerUrl);

        res.json({
          qr_code: qrImage,
          viewerUrl
        });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ZIP processing failed" });
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