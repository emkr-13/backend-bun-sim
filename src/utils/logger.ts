/**
 * @swagger
 * components:
 *   schemas:
 *     LogEntry:
 *       type: object
 *       properties:
 *         level:
 *           type: string
 *           description: Log level (info, error, warn, debug)
 *         message:
 *           type: string
 *           description: Log message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the log was created
 *         meta:
 *           type: object
 *           description: Additional metadata for the log entry
 */

import pino from "pino";
import path from "path";
import { createStream } from "rotating-file-stream";
import { multistream } from "pino-multi-stream";

// Helper function for formatting date
const pad = (num: number) => (num > 9 ? "" : "0") + num;

let logger: pino.Logger;

// In production (serverless) environment, only log to console
if (process.env.NODE_ENV === "production") {
  logger = pino({
    level: "info",
    base: null,
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  });
} else {
  // Create a rotating log stream for development
  const logDirectory = path.join(process.cwd(), "logs"); // Directory to store logs

  const logStream = createStream(
    () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      return `app-${year}-${month}-${day}.log`;
    },
    {
      interval: "1d", // Rotate logs daily
      path: logDirectory, // Directory to store logs
    }
  );

  // Combine console and file streams using pino-multi-stream
  const streams = [
    { stream: process.stdout }, // Log to console
    { stream: logStream }, // Log to file
  ];

  // Create a Pino logger instance with multi-stream
  logger = pino(
    {
      level: "info", // Default log level
      base: null, // Disable default metadata (hostname, pid)
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
    },
    multistream(streams) // Use multistream to combine streams
  );
}

/**
 * Log API errors with additional context
 * @param statusCode HTTP status code
 * @param message Error message
 * @param endpoint API endpoint where error occurred
 * @param error Original error object (optional)
 */
export const logApiError = (
  statusCode: number,
  message: string,
  endpoint: string,
  error?: any
) => {
  logger.error(
    {
      statusCode,
      message,
      endpoint,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    },
    `API Error [${statusCode}] at ${endpoint}: ${message}`
  );
};

/**
 * Log API success operations with additional context
 * @param statusCode HTTP status code
 * @param message Success message
 * @param endpoint API endpoint
 * @param userId User ID if available
 * @param action Operation performed
 * @param data Response data (optional, logged in a safe way)
 */
export const logApiSuccess = (
  statusCode: number,
  message: string,
  endpoint: string,
  userId?: number | string | null,
  action?: string,
  data?: any
) => {
  // Only log minimal info about sensitive data
  const safeData = data
    ? {
        hasData: !!data,
        dataType:
          typeof data === "object"
            ? Array.isArray(data)
              ? "array"
              : "object"
            : typeof data,
      }
    : undefined;

  logger.info(
    {
      statusCode,
      message,
      endpoint,
      userId,
      action,
      safeData,
      timestamp: new Date().toISOString(),
    },
    `API Success [${statusCode}] at ${endpoint}: ${message}${
      userId ? ` for user ${userId}` : ""
    }${action ? ` - ${action}` : ""}`
  );
};

/**
 * Log API requests for analytics and debugging
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param statusCode Response status code
 * @param responseTime Time taken to process request (ms)
 */
export const logApiRequest = (
  method: string,
  endpoint: string,
  statusCode: number,
  responseTime: number
) => {
  logger.info(
    {
      method,
      endpoint,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
    },
    `API ${method} ${endpoint} - ${statusCode} (${responseTime}ms)`
  );
};

export default logger;
