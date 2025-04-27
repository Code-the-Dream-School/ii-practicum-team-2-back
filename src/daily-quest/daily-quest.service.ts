import { prisma } from "@/db/prisma";
import {
  DailyQuestCompletionModel,
  DailyQuestModel,
  DailyQuestWithCompletionModel,
  toDailyQuestModel,
} from "./daily-quest.domain.types";
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
  validateDailyQuestForCreate,
  validateDailyQuestForUpdate,
} from "@/daily-quest/daily-quest.validators";
import QueryParams from "@/types/queryParams";
import { Frequency } from "@/types/enums";
import InconsistentColumnDataDomainException from "../errors/domain/inconsistentColumnDataDomain";
import { format, startOfDay } from "date-fns";

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
    try {
      await validateDailyQuestForCreate(userId, form);

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
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new goal cannot be created with this email",
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
    try {
      await validateDailyQuestForUpdate(id, userId, form);

      const dailyQuest = await prisma.dailyQuest.update({
        where: { id },
        data: {
          title: form.title,
          icon: form.icon,
          frequency: form.frequency,
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
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new goal cannot be created with this email",
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

  getForDate = async (
    userId: string,
    { limit, sortBy, sortOrder, date }: QueryParams
  ): Promise<DailyQuestWithCompletionModel[]> => {
    if (!date) {
      throw new ValidationDomainException({
        context: { date: ["Query parameter 'date' is required"] },
      });
    }

    const dayOfWeek = (format(date, "EEEE") + "s") as Frequency;
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
      include: {
        daily_quest_completions: {
          where: { date: date },
        },
      },
    });

    return dailyQuests.map((quest) => ({
      ...quest,
      frequency: quest.frequency as Frequency[],
      daily_quest_completion: quest.daily_quest_completions,
    }));
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
    try {
      await validateDailyQuestExists(questId, userId);

      const dateOnly = startOfDay(date);

      const dailyQuestCompletion = await this.findQuestCompletion(
        questId,
        userId,
        dateOnly
      );
      if (dailyQuestCompletion) {
        await prisma.dailyQuestCompletion.delete({
          where: { id: dailyQuestCompletion.id },
        });

        return true;
      }

      await this.createQuestCompletion(questId, userId, dateOnly);

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
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new daily quest cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message:
            "There is no daily quest completion cannot with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  getDailyQuestIdsAddedWithSuggestion = async (
    userId: string
  ): Promise<string[]> => {
    return (await this.getDailyQuestsAddedWithSuggestion(userId))
      .map((quest) => quest.suggestion_id)
      .filter((suggestionId): suggestionId is string => suggestionId != null);
  };

  private findQuestCompletion = async (
    questId: string,
    userId: string,
    date: Date
  ): Promise<DailyQuestCompletionModel | null> => {
    return prisma.dailyQuestCompletion.findFirst({
      where: {
        daily_quest_id: questId,
        user_id: userId,
        date,
      },
    });
  };

  private createQuestCompletion = async (
    questId: string,
    userId: string,
    date: Date
  ): Promise<DailyQuestCompletionModel> => {
    return prisma.dailyQuestCompletion.create({
      data: {
        daily_quest_id: questId,
        user_id: userId,
        date,
        completed_at: new Date(),
      },
    });
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
      distinct: ["suggestion_id"],
    });
  };
}
