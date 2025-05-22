import "reflect-metadata";
import express from "express";
import routes from "../src/routes";
import cors from "cors";
import logger from "./logger";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../src/config/swagger";
import { requestLogger, errorLogger } from "./loggerMiddleware";

const app = express();

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

// Export the Express app for Vercel
export default app;
