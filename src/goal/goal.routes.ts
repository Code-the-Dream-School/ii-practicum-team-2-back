import { RequestHandler, Router } from "express";
import GoalController from "./goal.controller";
import { queryParamsParser } from "@/middleware/queryParams";
import { auth } from "@/middleware/authentication";
import { routeParamsParser } from "@/middleware/routeParams";

const router = Router();
const goalController = new GoalController();

router.get(
  "/",
  auth,
  queryParamsParser,
  goalController.getAll as RequestHandler
);
router.get(
  "/:id",
  auth,
  routeParamsParser,
  goalController.getById as RequestHandler
);
router.post("/", auth, goalController.create as RequestHandler);
router.patch(
  "/:id",
  auth,
  routeParamsParser,
  goalController.update as RequestHandler
);
router.delete(
  "/:id",
  auth,
  routeParamsParser,
  goalController.delete as RequestHandler
);

router.patch(
  "/:id/field-values",
  auth,
  routeParamsParser,
  goalController.updateFieldValues as RequestHandler
);
,
export default router;
