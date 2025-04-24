import { prisma } from "@/db/prisma";
import { DailyQuestModel, toDailyQuestModel } from "./daily-quest.domain.types";
import {
  CreateDailyQuestFormType,
  UpdateDailyQuestFormType,
} from "./daily-quest.forms";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  ForeignKeyConstraintDomainException,
  NotFoundDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import { logPrismaKnownError } from "@/utils/logger";
import {
  validateDailyQuestExists,
  validateDailyQuestForUpdate,
  validateGoalExists,
} from "@/daily-quest/daily-quest.validators";
import QueryParams from "@/types/queryParams";
import { Frequency } from "@/types/enums";
import { normalizeToDateOnly } from "@/utils/date";

export default class DailyQuestService {
  findAll = async (
    userId: string,
    { limit, sortBy, sortOrder }: QueryParams
  ): Promise<DailyQuestModel[]> => {
    const dailyQuests = await prisma.dailyQuest.findMany({
      where: { user_id: userId },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
    });

    return dailyQuests.map(toDailyQuestModel);
  };

  findById = async (id: string, userId: string): Promise<DailyQuestModel> => {
    try {
      const dailyQuest = await prisma.dailyQuest.findFirstOrThrow({
        where: {
          id,
          user_id: userId,
        },
      });

      return toDailyQuestModel(dailyQuest);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.NOT_FOUND_CODE) {
          logPrismaKnownError(e);

          throw new NotFoundDomainException({
            message: "There is no daily quest with the given data",
          });
        }

        throw new UnknownDomainException({
          message: "There is no daily quest with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  create = async (
    userId: string,
    form: CreateDailyQuestFormType
  ): Promise<DailyQuestModel> => {
    await validateGoalExists(userId, form);

    try {
      const dailyQuest = await prisma.dailyQuest.create({
        data: {
          title: form.title,
          icon: form.icon,
          frequency: form.frequency ?? [],
          goal_id: form.goal_id ?? null,
          suggestion_id: form.suggestion_id ?? null,
          user_id: userId,
        },
      });

      return toDailyQuestModel(dailyQuest);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message: "A new daily quest cannot be created with this email",
          });
        }
        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message: "A new daily quest cannot be created with this name",
          });
        }

        throw new UnknownDomainException({
          message: "There is no daily quest with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  update = async (
    id: string,
    userId: string,
    form: UpdateDailyQuestFormType
  ): Promise<DailyQuestModel> => {
    await validateDailyQuestForUpdate(id, userId, form);

    try {
      const dailyQuest = await prisma.dailyQuest.update({
        where: { id },
        data: {
          title: form.title,
          icon: form.icon,
          goal_id: form.goal_id ?? null,
          frequency: form.frequency,
        },
      });

      return toDailyQuestModel(dailyQuest);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new UniqueConstraintDomainException({
          message: "Daily quest with this title already exists",
        });
      }

      throw new UnknownDomainException({
        message: "Failed to update daily quest",
        context: { e },
      });
    }
  };

  getForDate = async (
    userId: string,
    { limit, sortBy, sortOrder, date }: QueryParams
  ): Promise<DailyQuestModel[]> => {
    if (!date) {
      throw new ValidationDomainException({
        context: { date: ["Query parameter 'date' is required"] },
      });
    }

    const dayOfWeek = (date.toLocaleString("en-US", { weekday: "long" }) +
      "s") as Frequency;
    if (!(dayOfWeek in Frequency)) {
      throw new ValidationDomainException({
        context: { date: ["Invalid weekday format derived from date"] },
      });
    }

    const dailyQuests = await prisma.dailyQuest.findMany({
      where: {
        user_id: userId,
        OR: [
          { frequency: { has: Frequency.Daily } },
          { frequency: { has: dayOfWeek } },
        ],
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
    });

    return dailyQuests.map(toDailyQuestModel);
  };

  delete = async (id: string, userId: string): Promise<void> => {
    await validateDailyQuestExists(id, userId);

    await prisma.dailyQuest.delete({
      where: { id },
    });
  };

  toggleCompletion = async (
    questId: string,
    userId: string,
    date: Date
  ): Promise<boolean> => {
    await validateDailyQuestExists(questId, userId);

    try {
      const dateOnly = await normalizeToDateOnly(date);

      const dailyQuestCompletion = await prisma.dailyQuestCompletion.findFirst({
        where: {
          daily_quest_id: questId,
          user_id: userId,
          date: dateOnly,
        },
      });

      if (dailyQuestCompletion) {
        await prisma.dailyQuestCompletion.delete({
          where: { id: dailyQuestCompletion.id },
        });

        return true;
      }

      await prisma.dailyQuestCompletion.create({
        data: {
          daily_quest_id: questId,
          user_id: userId,
          date: dateOnly,
          completed_at: new Date(),
        },
      });

      return true;
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message:
              "A new daily quest completion cannot be created with this data",
          });
        }
        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message:
              "A new daily quest completion cannot be created with this data",
          });
        }

        throw new UnknownDomainException({
          message: "There is no quest completion cannot with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  getDailyQuestIdsAddedWithSuggestion = async (userId: string) => {
    return (await this.getDailyQuestsAddedWithSuggestion(userId)).map(
      (row) => row.suggestion_id!
    );
  };

  private getDailyQuestsAddedWithSuggestion = async (
    userId: string
  ): Promise<{ suggestion_id: string | null }[]> => {
    return prisma.dailyQuest.findMany({
      where: {
        user_id: userId,
        suggestion_id: { not: null },
      },
      select: { suggestion_id: true },
    });
  };
}
