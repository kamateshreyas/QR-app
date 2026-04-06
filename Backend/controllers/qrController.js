const archiver = require("archiver");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const QRCode = require("qrcode");
const { createQR,getAllQR} = require("../models/qrModel");

exports.uploadFileQR = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let zipBuffer;

    // ✅ CHECK: if already ZIP
    if (req.file.mimetype === "application/zip") {
      zipBuffer = req.file.buffer;
    } else {
      // ✅ CONVERT NORMAL FILE → ZIP
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

    // ✅ UPLOAD ZIP TO CLOUDINARY
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "qr_files",
          resource_type: "raw" // important for zip
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      streamifier.createReadStream(zipBuffer).pipe(uploadStream);
    });

    // ✅ SAVE IN DB
    c// ❗ FIRST create viewer URL (temporary id not needed yet)
    const tempId = Date.now(); // temporary unique id
    const viewerUrl = `${process.env.FRONTEND_URL}/view.html?id=${tempId}`;

    // ✅ GENERATE QR FIRST
    const qrImage = await QRCode.toDataURL(viewerUrl);

    // ✅ SAVE IN DB WITH QR
    const idData = await createQR("zip", uploadResult.secure_url, qrImage);
    const id = idData?.[0]?.id;

    if (!id) {
      return res.status(500).json({ error: "DB insert failed" });
    }

    // ❗ OPTIONAL: regenerate QR with real id (better)
    const finalViewerUrl = `${process.env.FRONTEND_URL}/view.html?id=${id}`;
    const finalQR = await QRCode.toDataURL(finalViewerUrl);

res.json({
  qr_code: finalQR,
  viewerUrl: finalViewerUrl
});

    res.json({
      qr_code: qrImage,
      viewerUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File processing failed" });
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