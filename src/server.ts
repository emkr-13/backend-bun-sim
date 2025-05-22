import "reflect-metadata";
import express from "express";
import routes from "./routes";
import cors from "cors";
import logger from "./utils/logger"; // Import logger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import { requestLogger, errorLogger } from "./middleware/loggerMiddleware";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

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

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      docExpansion: "none",
      persistAuthorization: true,
    },
  })
);

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
  });
}

// Export the Express app for Vercel deployment
export default app;
