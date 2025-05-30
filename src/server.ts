import "reflect-metadata";
import express from "express";
import routes from "./routes";
import cors from "cors";
import logger from "./utils/logger"; // Import logger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import { requestLogger, errorLogger } from "./middleware/loggerMiddleware";
import path from "path";
// Import all documentation to ensure it's included in the build
import "./docs";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Apply request logger middleware
app.use(requestLogger);

// Add a simple test endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is working",
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL || "Not available",
  });
});

// Custom Swagger UI route
app.get("/api-docs-alt", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/swagger-ui.html"));
});

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerUrl: "/api-docs.json",
    swaggerOptions: {
      docExpansion: "none",
      persistAuthorization: true,
    },
  })
);

// Endpoint to serve Swagger JSON
app.get("/api-docs.json", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(swaggerSpec, null, 2));
  } catch (error) {
    logger.error(`Error serving swagger JSON: ${error}`);
    res.status(500).json({ error: "Failed to generate API documentation" });
  }
});

// API routes
app.use("/api", routes);

// Error logger middleware
app.use(errorLogger);

// Start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Access the application at http://localhost:${PORT}`);
    logger.info(
      `Access API documentation at http://localhost:${PORT}/api-docs`
    );
    logger.info(
      `Access Swagger JSON at http://localhost:${PORT}/api-docs.json`
    );
  });
}

// Export the Express app for Vercel deployment
export default app;
