const express = require("express");
const cors = require("cors");
require("dotenv").config();

const qrRoutes = require("./routes/qrRoutes");

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});