import type { Express, Request, Response } from "express-serve-static-core";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "#root/swagger.json";

const swaggerSpecJson = JSON.parse(JSON.stringify(swaggerSpec));

const swaggerDocs = (app: Express): void => {
  // Swagger UI page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecJson));

  // API endpoint for Swagger docs in JSON format
  app.get("/docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecJson);
  });

  const { PORT = 8000 } = process.env;

  console.info(`Docs available at http://localhost:${PORT}/docs`);
};

export default swaggerDocs;
