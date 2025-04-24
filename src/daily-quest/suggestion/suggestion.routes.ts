import { Router } from "express";
import DailyQuestSuggestionController from "./suggestion.controller";
import { queryParamsParser } from "@/middleware/queryParams";

const suggestionRouter = Router();
const suggestionController = new DailyQuestSuggestionController();

suggestionRouter.get("/", queryParamsParser, suggestionController.getAll);
suggestionRouter.get("/:id", suggestionController.getById);
suggestionRouter.post("/", suggestionController.create);
suggestionRouter.patch("/:id", suggestionController.update);
suggestionRouter.delete("/:id", suggestionController.delete);

export default suggestionRouter;
