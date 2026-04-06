const archiver = require("archiver");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const QRCode = require("qrcode");
const { createQR,getAllQR} = require("../models/qrModel");
const supabase =require("../database/db")
const crypto = require("crypto");

exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let zipBuffer = req.file.buffer;

    // Convert to ZIP if not already
    if (req.file.mimetype !== "application/zip") {
      const archive = archiver("zip", { zlib: { level: 9 } });
      const chunks = [];

      archive.append(req.file.buffer, { name: req.file.originalname });

      await new Promise((resolve, reject) => {
        archive.on("data", (data) => chunks.push(data));
        archive.on("end", resolve);
        archive.on("error", reject);
        archive.finalize();
      });

      zipBuffer = Buffer.concat(chunks);
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "qr_files", resource_type: "raw" },
        (err, result) => (err ? reject(err) : resolve(result))
      );

      streamifier.createReadStream(zipBuffer).pipe(stream);
    });

    // Generate ID + QR
    const id = crypto.randomUUID();
    const viewerUrl = `${process.env.FRONTEND_URL}/view.html?id=${id}`;
    const qrImage = await QRCode.toDataURL(viewerUrl);

    // Save to DB
    await supabase.from("qr_codes").insert([
      {
        id,
        type: "zip",
        content: uploadResult.secure_url,
        qr_code: qrImage
      }
    ]);

    return res.json({ qr_code: qrImage, viewerUrl });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "File processing failed" });
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

    if (!data) return res.json([]);

    res.json(data);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};