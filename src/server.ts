import express from "express";
import routes from "./routes";
import cors from "cors";
import logger from "./utils/logger"; // Import logger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access the application at http://localhost:${PORT}`);
  logger.info(`Access API documentation at http://localhost:${PORT}/api-docs`);
});
