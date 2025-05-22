import swaggerJsdoc from "swagger-jsdoc";

// Determine the base URL based on environment
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.APP_PORT || 3000}`;
};

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
        url: getBaseUrl(),
        description: "API Server",
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
    "./src/**/*.ts", // Include all TypeScript files in src directory
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
