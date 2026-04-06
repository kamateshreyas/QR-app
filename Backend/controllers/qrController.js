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

    let fileBuffer = req.file.buffer;
    let fileType = "zip";

    // ✅ CHECK IF IMAGE
    if (req.file.mimetype.startsWith("image")) {
      fileType = "image";
    } else {
      // ✅ convert to zip ONLY if not image
      const archive = archiver("zip", { zlib: { level: 9 } });
      const chunks = [];

      archive.append(req.file.buffer, { name: req.file.originalname });

      await new Promise((resolve, reject) => {
        archive.on("data", (data) => chunks.push(data));
        archive.on("end", resolve);
        archive.on("error", reject);
        archive.finalize();
      });

      fileBuffer = Buffer.concat(chunks);
    }

    // ✅ upload correct buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "qr_files",
          resource_type: "auto" // ✅ IMPORTANT
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    });

    // ✅ generate id + QR
    const id = crypto.randomUUID();
    const viewerUrl = `${process.env.FRONTEND_URL}/viewer.html?id=${id}`;
    const qrImage = await QRCode.toDataURL(viewerUrl);

    // ✅ SAVE CORRECT TYPE
    const { error } = await supabase.from("qr_codes").insert([
      {
        id,
        type: fileType, // ✅ FIXED
        content: uploadResult.secure_url,
        qr_code: qrImage
      }
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "DB insert failed" });
    }

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

    if (!data || !Array.isArray(data)) {
      return res.json([]);
    }

    return res.json(data);

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return res.json([]); // ✅ NEVER break frontend
  }
};
exports.getQRById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};