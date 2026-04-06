const express = require("express");
const cors = require("cors");
require("dotenv").config();

const qrRoutes = require("./routes/qrRoutes");

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://https://qr-app-chi-ten.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// JSON parsing
app.use(express.json());

// Request logger (debug)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api/qr", qrRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});