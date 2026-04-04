const express = require("express");
const path = require("path");
const cors = require("cors");
const qrRoutes = require("./routes/qrRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static folder for files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ Routes
app.use("/api/qr", qrRoutes);
// ✅ Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});