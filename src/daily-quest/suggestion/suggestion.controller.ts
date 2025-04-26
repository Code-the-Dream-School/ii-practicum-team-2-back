import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import DailyQuestSuggestionService from "@/daily-quest/suggestion/suggestion.service";
import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { NotFoundError, UnprocessableEntityError } from "@/errors/http";
import { FlattenedFieldErrors } from "@/types/zod";
import {
  toDailyQuestSuggestionResponse,
  toDailyQuestSuggestionResponses,
} from "@/daily-quest/suggestion/suggestion.types";
import { AuthenticatedRequest } from "@/types/express";
import {
  CreateDailyQuestSuggestionForm,
  UpdateDailyQuestSuggestionForm,
} from "@/daily-quest/suggestion/suggestion.forms";

export default class DailyQuestSuggestionController {
  private dailyQuestSuggestionService = new DailyQuestSuggestionService();

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const suggestions = await this.dailyQuestSuggestionService.findAll(
      req.user.id,
      req.queryParams!
    );

    res
      .status(StatusCodes.OK)
      .json({ data: toDailyQuestSuggestionResponses(suggestions) });
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const suggestion = await this.dailyQuestSuggestionService.findById(
        req.params.id
      );

      res
        .status(StatusCodes.OK)
        .json(toDailyQuestSuggestionResponse(suggestion));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = CreateDailyQuestSuggestionForm.safeParse(req.body);
    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const suggestion = await this.dailyQuestSuggestionService.create(
        result.data
      );

      res
        .status(StatusCodes.CREATED)
        .json(toDailyQuestSuggestionResponse(suggestion));
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
    const result = UpdateDailyQuestSuggestionForm.safeParse(req.body);
    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const suggestion = await this.dailyQuestSuggestionService.update(
        req.routeParams!.id,
        result.data
      );

      res
        .status(StatusCodes.OK)
        .json(toDailyQuestSuggestionResponse(suggestion));
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

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.dailyQuestSuggestionService.delete(req.params.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };
}
