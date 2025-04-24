import type { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import DailyQuestSuggestionService from "@/daily-quest/suggestion/suggestion.service";
import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { NotFoundError, UnprocessableEntityError } from "@/errors/http";
import {
  CreateDailyQuestForm,
  UpdateDailyQuestForm,
} from "@/daily-quest/daily-quest.forms";
import { FlattenedFieldErrors } from "@/types/zod";
import {
  toDailyQuestSuggestionResponse,
  toDailyQuestSuggestionResponses,
} from "@/daily-quest/suggestion/suggestion.types";

export default class DailyQuestSuggestionController {
  private dailyQuestSuggestionService = new DailyQuestSuggestionService();

  getAll = async (req: Request, res: Response): Promise<void> => {
    const suggestions = await this.dailyQuestSuggestionService.findAll(
      // req.user.id,
      "7171f91a-bd67-41c2-9e38-7d81be9edf22",
      req.queryParams
    );

    res
      .status(StatusCodes.OK)
      .json({ data: toDailyQuestSuggestionResponses(suggestions) });
  };

  async getById(req: Request, res: Response): Promise<void> {
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
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const result = CreateDailyQuestForm.safeParse(req.body);
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

  update = async (req: Request, res: Response): Promise<void> => {
    const result = UpdateDailyQuestForm.safeParse(req.body);
    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const suggestion = await this.dailyQuestSuggestionService.update(
        req.params.id,
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

  delete = async (req: Request, res: Response): Promise<void> => {
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
