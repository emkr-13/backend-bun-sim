import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Simple root endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Simple API endpoint to check service status
app.get("/api/status", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Export the Express app for Vercel
export default app;
