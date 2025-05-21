import swaggerJsdoc from "swagger-jsdoc";
import pkg from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API Documentation",
      version: "1.0.0",
      description: "API documentation for the backend application",
    },
    servers: [
      {
        url: `http://localhost:${process.env.APP_PORT || 3000}`,
        description: "Development server (HTTP)",
      },
      {
        url: `https://localhost:${process.env.APP_PORT || 3000}`,
        description: "Development server (HTTPS)",
      },
    ],
    tags: [
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Authentication",
        description:
          "Authentication endpoints for login, register, and token management",
      },
      {
        name: "Akun",
        description: "Account management endpoints",
      },
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "Categories",
        description: "Category management endpoints",
      },
      {
        name: "Stores",
        description: "Store management endpoints",
      },
      {
        name: "Quotation",
        description: "Quotation management endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/models/*.ts",
    "./src/dtos/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
