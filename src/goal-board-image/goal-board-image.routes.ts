import { Router } from "express";
import GoalBoardImageController from "./goal-board-image.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const goalBoardImageRouter = Router();
const goalBoardImageController = new GoalBoardImageController();

goalBoardImageRouter.get(
  "/",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    goalBoardImageController.getAll
  )
);
goalBoardImageRouter.post(
  "/upload",
  auth,
  asyncController<AuthenticatedRequest>(goalBoardImageController.upload)
);
goalBoardImageRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalBoardImageController.remove
  )
);

export default goalBoardImageRouter;
