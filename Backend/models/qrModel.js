const db = require("../../database/db");

// Insert QR
const createQR = (data, callback) => {
  const sql = "INSERT INTO qr_codes (type, content, qr_code) VALUES (?, ?, ?)";
  db.query(sql, [data.type, data.content, data.qr_code], callback);
};

// Get all QR
const getAllQR = (callback) => {
  db.query("SELECT * FROM qr_codes ORDER BY created_at DESC", callback);
};
module.exports = {
    createQR,
    getAllQR
};
