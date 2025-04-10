import type { Express, Request, Response } from "express-serve-static-core";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "@/config";
import swagger_poc_json from "../schema/swagger_poc.json";

const swaggerSpec = swaggerJsdoc(config.swagger);
const swaggerPocSpec = JSON.parse(JSON.stringify(swagger_poc_json));

const swaggerDocs = (app: Express): void => {
  // Swagger UI page
  app.use("/docs-old", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // TODO: replace this when spec is defined
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerPocSpec));

  // API endpoint for Swagger docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerPocSpec);
  });
  app.get("/docs-old.json", (req: Request, res: Response) => {
    // TODO: replace this when spec is defined
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  const { PORT = 8000 } = process.env;

  console.info(`Docs available at http://localhost:${PORT}/docs`);
};

export default swaggerDocs;
