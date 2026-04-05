const db = require("../database/db");

exports.createQR = async (type, content, qr) => {
  const query = `
    INSERT INTO qr_codes (type, content, qr_code)
    VALUES ($1, $2, $3)
  `;
  await db.query(query, [type, content, qr]);
};

exports.getAllQR = async () => {
  const result = await db.query(
    "SELECT * FROM qr_codes ORDER BY id DESC"
  );
  return result.rows;
};