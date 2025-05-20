import { Response, Request } from "express";
import { logApiSuccess, logApiError } from "./logger";

export interface ResponseOptions {
  logDetails?: boolean;
  action?: string;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  options?: ResponseOptions
) => {
  const req = res.req as Request;
  const endpoint = `${req.baseUrl}${req.path}`;
  const userId = (req as any).user?.id;

  // Log successful responses
  if (statusCode >= 200 && statusCode < 300 && options?.logDetails !== false) {
    logApiSuccess(
      statusCode,
      message,
      endpoint,
      userId,
      options?.action || getDefaultAction(endpoint, req.method),
      data
    );
  }
  // Log error responses
  else if (statusCode >= 400 && options?.logDetails !== false) {
    logApiError(statusCode, message, endpoint);
  }

  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

/**
 * Helper function to determine the action based on the endpoint and method
 */
function getDefaultAction(endpoint: string, method: string): string {
  if (endpoint.includes("login")) {
    return "User login";
  } else if (endpoint.includes("register")) {
    return "User registration";
  } else if (endpoint.includes("create") || method === "POST") {
    return "Create operation";
  } else if (endpoint.includes("update") || method === "PUT") {
    return "Update operation";
  } else if (endpoint.includes("delete") || method === "DELETE") {
    return "Delete operation";
  } else if (endpoint.includes("detail")) {
    return "Fetch details";
  } else if (endpoint.includes("all") || method === "GET") {
    return "Data retrieval";
  }
  return "API operation";
}
