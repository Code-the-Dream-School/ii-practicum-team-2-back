import { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import {
  CreateDailyQuestForm,
  UpdateDailyQuestForm,
} from "@/daily-quest/daily-quest.forms";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/errors/http";
import DailyQuestService from "@/daily-quest/daily-quest.service";
import {
  toDailyQuestForDateResponseList,
  toDailyQuestResponse,
  toDailyQuestResponseList,
} from "@/daily-quest/daily-quest.types";
import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { FlattenedFieldErrors } from "@/types/zod";
import {
  AuthenticatedRequest,
  RequestWithQueryParams,
  RequestWithRouteParams,
} from "@/types/express";

export default class DailyQuestController {
  private dailyQuestService = new DailyQuestService();

  getAll = async (
    req: AuthenticatedRequest & RequestWithQueryParams,
    res: Response
  ): Promise<void> => {
    const quests = await this.dailyQuestService.findAll(
      req.user.id,
      req.queryParams
    );

    res.status(StatusCodes.OK).json({ data: toDailyQuestResponseList(quests) });
  };

  getById = async (
    req: AuthenticatedRequest & RequestWithRouteParams,
    res: Response
  ): Promise<void> => {
    try {
      const quest = await this.dailyQuestService.findById(
        req.routeParams.id,
        req.user.id
      );

      res.status(StatusCodes.OK).json(toDailyQuestResponse(quest));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = CreateDailyQuestForm.safeParse(req.body);
    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const quest = await this.dailyQuestService.create(
        req.user.id,
        result.data
      );

      res.status(StatusCodes.CREATED).json(toDailyQuestResponse(quest));
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

  getForDate = async (
    req: AuthenticatedRequest & RequestWithQueryParams,
    res: Response
  ): Promise<void> => {
    if (!req.queryParams.date) {
      throw new BadRequestError({
        message: "Query parameter 'date' is required",
      });
    }

    const quests = await this.dailyQuestService.getForDate(
      req.user.id,
      req.queryParams
    );

    res.status(StatusCodes.OK).json({
      data: toDailyQuestForDateResponseList(quests),
    });
  };

  update = async (
    req: AuthenticatedRequest & RequestWithRouteParams,
    res: Response
  ): Promise<void> => {
    const result = UpdateDailyQuestForm.safeParse(req.body);
    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const quest = await this.dailyQuestService.update(
        req.routeParams.id,
        req.user.id,
        result.data
      );

      res.status(StatusCodes.OK).json(toDailyQuestResponse(quest));
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

  delete = async (
    req: AuthenticatedRequest & RequestWithRouteParams,
    res: Response
  ): Promise<void> => {
    try {
      await this.dailyQuestService.delete(req.routeParams.id, req.user.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  toggleCompletion = async (
    req: AuthenticatedRequest & RequestWithRouteParams,
    res: Response
  ): Promise<void> => {
    const { date } = req.body;

    if (!date) {
      throw new UnprocessableEntityError({
        errors: { date: ["Date is required in request body"] },
      });
    }

    try {
      await this.dailyQuestService.toggleCompletion(
        req.routeParams.id,
        req.user.id,
        new Date(date)
      );

      res.status(StatusCodes.OK).send();
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };
}
