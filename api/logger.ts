import pino from "pino";

// Create a simple Pino logger instance that only logs to console
const logger = pino({
  level: "info",
  base: null,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

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
