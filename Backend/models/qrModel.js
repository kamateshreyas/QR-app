const db = require("../../database/db");

// Insert QR
exports.createQR = (data, callback) => {
  const sql = "INSERT INTO qr_codes (type, content, qr_code) VALUES (?, ?, ?)";
  db.query(sql, [data.type, data.content, data.qr_code], callback);
};

// Get all QR
exports.getAllQR = (callback) => {
  db.query("SELECT * FROM qr_codes ORDER BY created_at DESC", callback);
};