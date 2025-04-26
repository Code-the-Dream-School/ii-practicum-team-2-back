import { RequestHandler, Router } from "express";
import DailyQuestController from "./daily-quest.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const dailyQuestRouter = Router();
const dailyQuestController = new DailyQuestController();

dailyQuestRouter.get(
  "/",
  auth,
  queryParamsParser,
  dailyQuestController.getAll as RequestHandler
);
dailyQuestRouter.get(
  "/for-date",
  auth,
  queryParamsParser,
  dailyQuestController.getForDate as RequestHandler
);
dailyQuestRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  dailyQuestController.getById as RequestHandler
);
dailyQuestRouter.post("/", auth, dailyQuestController.create as RequestHandler);
dailyQuestRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  dailyQuestController.update as RequestHandler
);
dailyQuestRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  dailyQuestController.delete as RequestHandler
);
dailyQuestRouter.post(
  "/:id/toggle",
  auth,
  routeParamsParser,
  dailyQuestController.toggleCompletion as RequestHandler
);
,
export default dailyQuestRouter;
