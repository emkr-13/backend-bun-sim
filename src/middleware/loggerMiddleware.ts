/**
 * @swagger
 * components:
 *   schemas:
 *     ApiLog:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP status code of the response
 *         method:
 *           type: string
 *           description: HTTP method (GET, POST, PUT, DELETE, etc.)
 *         endpoint:
 *           type: string
 *           description: API endpoint that was requested
 *         responseTime:
 *           type: integer
 *           description: Time taken to process the request in milliseconds
 *         message:
 *           type: string
 *           description: Log message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the log was created
 *         stack:
 *           type: string
 *           description: Error stack trace (for error logs only)
 */

import { Request, Response, NextFunction } from "express";
import { logApiRequest, logApiError, logApiSuccess } from "../utils/logger";

/**
 * Middleware to log all API requests and responses
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const endpoint = `${req.baseUrl}${req.path}`;
  const method = req.method;

  // Capture the original send function to intercept the response
  const originalSend = res.send;

  // Override the send function to log the response before sending it
  res.send = function (body?: any): Response {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log the request and response details
    logApiRequest(method, endpoint, statusCode, responseTime);

    // If there's an error (4xx or 5xx status code), log it as an error
    if (statusCode >= 400) {
      let errorMessage = "";
      try {
        if (typeof body === "string") {
          const parsedBody = JSON.parse(body);
          errorMessage = parsedBody.message || "Unknown error";
        } else if (body && body.message) {
          errorMessage = body.message;
        }
      } catch (e) {
        errorMessage = body?.toString() || "Unknown error";
      }

      logApiError(statusCode, errorMessage, endpoint);
    }
    // If it's a successful operation (2xx status code), log it as a success
    else if (statusCode >= 200 && statusCode < 300) {
      let message = "";
      let data = null;
      let userId = null;

      try {
        if (typeof body === "string") {
          const parsedBody = JSON.parse(body);
          message = parsedBody.message || "Operation successful";
          data = parsedBody.data;
        } else if (body) {
          message = body.message || "Operation successful";
          data = body.data;
        }

        // Extract user ID if available in the request
        userId = (req as any).user?.id;

        // Determine the action based on the endpoint and method
        let action = "";
        if (endpoint.includes("login")) {
          action = "User login";
        } else if (endpoint.includes("register")) {
          action = "User registration";
        } else if (endpoint.includes("create")) {
          action = "Create operation";
        } else if (endpoint.includes("update")) {
          action = "Update operation";
        } else if (endpoint.includes("delete")) {
          action = "Delete operation";
        } else if (endpoint.includes("detail")) {
          action = "Fetch details";
        } else if (endpoint.includes("all") || method === "GET") {
          action = "Data retrieval";
        }

        logApiSuccess(statusCode, message, endpoint, userId, action, data);
      } catch (e) {
        // If something goes wrong with success logging, just continue
      }
    }

    // Call the original send function and return its result
    return originalSend.apply(res, [body]);
  };

  next();
};

/**
 * Error handling middleware that logs errors
 */
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const endpoint = `${req.baseUrl}${req.path}`;
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logApiError(statusCode, err.message, endpoint, err);

  next(err);
};
