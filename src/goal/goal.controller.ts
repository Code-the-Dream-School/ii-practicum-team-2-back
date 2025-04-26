import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import GoalService from "@/goal/goal.service";
import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { NotFoundError, UnprocessableEntityError } from "@/errors/http";
import { toGoalResponse, toGoalResponses } from "@/goal/goal.types";
import { GoalModel } from "@/goal/goal.domain.types";
import {
  CreateGoalForm,
  UpdateGoalFieldValuesForm,
  UpdateGoalForm,
} from "@/goal/goal.forms";
import { FlattenedFieldErrors } from "@/types/zod";
import { AuthenticatedRequest } from "@/types/express";

export default class GoalController {
  private goalService: GoalService = new GoalService();

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const goals: GoalModel[] = await this.goalService.findAll(
      req.user.id,
      req.queryParams!
    );

    res.status(StatusCodes.OK).json({ data: toGoalResponses(goals) });
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const goal: GoalModel = await this.goalService.findById(
        req.routeParams!.id,
        req.user.id
      );

      res.status(StatusCodes.OK).json(toGoalResponse(goal));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const createGoalForm = CreateGoalForm.safeParse(req.body);
    if (!createGoalForm.success) {
      throw new UnprocessableEntityError({
        errors: createGoalForm.error.flatten().fieldErrors,
      });
    }

    try {
      const goal: GoalModel = await this.goalService.create(
        req.user.id,
        createGoalForm.data
      );

      res.status(StatusCodes.CREATED).json(toGoalResponse(goal));
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

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const updateGoalForm = UpdateGoalForm.safeParse(req.body);
    if (!updateGoalForm.success) {
      throw new UnprocessableEntityError({
        errors: updateGoalForm.error.flatten().fieldErrors,
      });
    }

    try {
      const goal: GoalModel = await this.goalService.update(
        req.routeParams!.id,
        req.user.id,
        updateGoalForm.data
      );

      res.status(StatusCodes.OK).json(toGoalResponse(goal));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.goalService.delete(req.routeParams!.id, req.user.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  updateFieldValues = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const updateGoalFieldValuesForm = UpdateGoalFieldValuesForm.safeParse(
      req.body
    );

    if (!updateGoalFieldValuesForm.success) {
      throw new UnprocessableEntityError({
        errors: updateGoalFieldValuesForm.error.flatten().fieldErrors,
      });
    }

    try {
      const goal: GoalModel = await this.goalService.updateFieldValues(
        req.routeParams!.id,
        req.user.id,
        updateGoalFieldValuesForm.data
      );

      res.status(StatusCodes.OK).json(toGoalResponse(goal));
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
