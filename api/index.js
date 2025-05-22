const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Simple root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Export the Express app for Vercel
module.exports = app;
