const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const qrRoutes = require("./routes/qrRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/qr", qrRoutes);

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});