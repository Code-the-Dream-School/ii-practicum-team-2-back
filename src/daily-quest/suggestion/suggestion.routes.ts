import { Router } from "express";
import DailyQuestSuggestionController from "./suggestion.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const suggestionRouter = Router();
const suggestionController = new DailyQuestSuggestionController();

suggestionRouter.get(
  "/",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    suggestionController.getAll
  )
);
suggestionRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    suggestionController.getById
  )
);
suggestionRouter.post(
  "/",
  auth,
  asyncController<AuthenticatedRequest>(suggestionController.create)
);
suggestionRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    suggestionController.update
  )
);
suggestionRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    suggestionController.delete
  )
);

export default suggestionRouter;
