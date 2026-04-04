const db = require("../database/db");

// ✅ CREATE QR ENTRY
const createQR = (type, content, qrCode) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO qr_codes (type, content, qr_code) VALUES (?, ?, ?)";

    db.query(sql, [type, content, qrCode], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// ✅ GET HISTORY
const getAllQR = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM qr_codes ORDER BY id DESC";

    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  createQR,
  getAllQR,
};

