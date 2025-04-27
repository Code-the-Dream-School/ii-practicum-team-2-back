import { Router } from "express";
import GoalController from "./goal.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";
import { asyncController } from "@/utils/controller";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

const router = Router();
const goalController = new GoalController();

router.get(
  "/",
  auth,
  queryParamsParser,
  asyncController<AuthenticatedRequest & RequestWithQueryParams>(
    goalController.getAll
  )
);
router.get(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalController.getById
  )
);
router.post(
  "/",
  auth,
  asyncController<AuthenticatedRequest>(goalController.create)
);
router.patch(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalController.update
  )
);
router.delete(
  "/:id",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalController.delete
  )
);

router.patch(
  "/:id/field-values",
  auth,
  routeParamsParser,
  asyncController<AuthenticatedRequest & RequestWithRouteParams>(
    goalController.updateFieldValues
  )
);

export default router;
