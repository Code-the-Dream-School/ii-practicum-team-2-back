import { RequestHandler, Router } from "express";
import GoalTypeController from "./goal-type.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const goalTypeRouter = Router();
const goalTypeController = new GoalTypeController();

goalTypeRouter.get(
  "/",
  auth,
  queryParamsParser,
  goalTypeController.getAll as RequestHandler
);
goalTypeRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  goalTypeController.getById as RequestHandler
);
goalTypeRouter.post("/", auth, goalTypeController.create as RequestHandler);
goalTypeRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  goalTypeController.update as RequestHandler
);
goalTypeRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  goalTypeController.delete as RequestHandler
);

goalTypeRouter.post(
  "/:id/fields",
  auth,
  routeParamsParser,
  goalTypeController.addFields as RequestHandler
);
,
export default goalTypeRouter;
