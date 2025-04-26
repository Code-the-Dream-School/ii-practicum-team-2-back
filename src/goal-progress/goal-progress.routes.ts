import { RequestHandler, Router } from "express";
import GoalProgressController from "./goal-progress.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const goalProgressRouter = Router();
const goalProgressController = new GoalProgressController();

goalProgressRouter.get(
  "/:id/progress",
  auth,
  routeParamsParser,
  queryParamsParser,
  goalProgressController.getAll as RequestHandler
);
goalProgressRouter.post(
  "/:id/progress",
  auth,
  routeParamsParser,
  goalProgressController.create as RequestHandler
);

export default goalProgressRouter;
