import { Router } from "express";
import GoalProgressController from "./goal-progress.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const goalProgressRouter = Router();
const goalProgressController = new GoalProgressController();

goalProgressRouter.get(
  "/:id/progress",
  auth,
  routeParamsParser,
  queryParamsParser,
  asyncController<
    AuthenticatedRequest & RequestWithQueryParams & RequestWithRouteParams
  >(goalProgressController.getAll)
);
goalProgressRouter.post(
  "/:id/progress",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalProgressController.create
  )
);

export default goalProgressRouter;
