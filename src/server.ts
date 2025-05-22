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

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Export the Express app for Vercel
export default app;
