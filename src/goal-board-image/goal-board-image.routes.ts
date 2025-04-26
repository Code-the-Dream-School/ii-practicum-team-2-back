import { RequestHandler, Router } from "express";
import GoalBoardImageController from "./goal-board-image.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const goalBoardImageRouter = Router();
const goalBoardImageController = new GoalBoardImageController();

goalBoardImageRouter.get(
  "/",
  auth,
  queryParamsParser,
  goalBoardImageController.getAll as RequestHandler
);
goalBoardImageRouter.post(
  "/upload",
  auth,
  goalBoardImageController.upload as RequestHandler
);
goalBoardImageRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  goalBoardImageController.remove as RequestHandler
),;

export default goalBoardImageRouter;
