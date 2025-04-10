import swaggerJsdoc from "swagger-jsdoc";
import { version } from "#root/package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goal Tracker REST API Docs",
      version,
    },
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
    "./src/routes/**/*.ts",
    "./src/schema/*.ts",
    "./src/schema/*.json",
    "./src/dto/*.ts",
  ],
};

export default options;
