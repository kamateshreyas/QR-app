const mysql = require("mysql2");

// ✅ Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // your mysql username
  password: "720429", // your mysql password
  database: "qr_app"    // your database name
});

// ✅ Connect
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;