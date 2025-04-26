import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import GoalProgressService from "@/goal-progress/goal-progress.service";
import {
  toGoalProgressResponse,
  toGoalProgressResponses,
} from "@/goal-progress/goal-progress.types";
import { CreateGoalProgressForm } from "@/goal-progress/goal-progress.forms";
import { NotFoundError, UnprocessableEntityError } from "@/errors/http";
import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { FlattenedFieldErrors } from "@/types/zod";
import { AuthenticatedRequest } from "@/types/express";

export default class GoalProgressController {
  private goalProgressService: GoalProgressService = new GoalProgressService();

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const progress = await this.goalProgressService.findAll(
      req.user.id,
      req.routeParams!.id,
      req.queryParams!
    );

    res
      .status(StatusCodes.OK)
      .json({ data: toGoalProgressResponses(progress) });
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const createGoalProgressForm = CreateGoalProgressForm.safeParse(req.body);
    if (!createGoalProgressForm.success) {
      throw new UnprocessableEntityError({
        errors: createGoalProgressForm.error.flatten().fieldErrors,
      });
    }

    try {
      const progress = await this.goalProgressService.create(
        req.user.id,
        req.routeParams!.id,
        createGoalProgressForm.data
      );

      res.status(StatusCodes.CREATED).json(toGoalProgressResponse(progress));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }
      if (e instanceof ValidationDomainException) {
        throw new UnprocessableEntityError({
          errors: e.context as FlattenedFieldErrors,
        });
      }

      throw e;
    }
  };
}
