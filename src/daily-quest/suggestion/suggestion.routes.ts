import { RequestHandler, Router } from "express";
import DailyQuestSuggestionController from "./suggestion.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const suggestionRouter = Router();
const suggestionController = new DailyQuestSuggestionController();

suggestionRouter.get(
  "/",
  auth,
  queryParamsParser,
  suggestionController.getAll as RequestHandler
);
suggestionRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  suggestionController.getById as RequestHandler
);
suggestionRouter.post("/", auth, suggestionController.create as RequestHandler);
suggestionRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  suggestionController.update as RequestHandler
);
suggestionRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  suggestionController.delete as RequestHandler
);

export default suggestionRouter;
