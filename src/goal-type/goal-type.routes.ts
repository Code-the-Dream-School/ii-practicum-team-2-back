import { Router } from "express";
import GoalTypeController from "./goal-type.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const goalTypeRouter = Router();
const goalTypeController = new GoalTypeController();

goalTypeRouter.get(
  "/",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    goalTypeController.getAll
  )
);
goalTypeRouter.get(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalTypeController.getById
  )
);
goalTypeRouter.post(
  "/",
  auth,
  asyncController<AuthenticatedRequest>(goalTypeController.create)
);
goalTypeRouter.patch(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalTypeController.update
  )
);
goalTypeRouter.delete(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalTypeController.delete
  )
);

goalTypeRouter.post(
  "/:id/fields",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalTypeController.addFields
  )
);

export default goalTypeRouter;
