import { Router } from "express";
import DailyQuestController from "./daily-quest.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const dailyQuestRouter = Router();
const dailyQuestController = new DailyQuestController();

dailyQuestRouter.get(
  "/",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    dailyQuestController.getAll
  )
);
dailyQuestRouter.get(
  "/for-date",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    dailyQuestController.getForDate
  )
);
dailyQuestRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    dailyQuestController.getById
  )
);
dailyQuestRouter.post(
  "/",
  auth,
  asyncController<AuthenticatedRequest>(dailyQuestController.create)
);
dailyQuestRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    dailyQuestController.update
  )
);
dailyQuestRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    dailyQuestController.delete
  )
);
dailyQuestRouter.post(
  "/:id/toggle",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    dailyQuestController.toggleCompletion
  )
);

export default dailyQuestRouter;
