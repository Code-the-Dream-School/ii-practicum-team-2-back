import { prisma } from "@/db/prisma";
import {
  NotFoundDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
} from "@/errors/domain";
import {
  DailyQuestSuggestionModel,
  toDailyQuestSuggestionModel,
} from "@/daily-quest/suggestion/suggestion.domain.types";
import QueryParams from "@/types/queryParams";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import { logPrismaKnownError } from "@/utils/logger";
import {
  CreateDailyQuestSuggestionFormType,
  UpdateDailyQuestSuggestionFormType,
} from "@/daily-quest/suggestion/suggestion.forms";
import { validateDailyQuestSuggestionExists } from "@/daily-quest/suggestion/suggestion.validators";
import DailyQuestService from "@/daily-quest/daily-quest.service";

export default class DailyQuestSuggestionService {
  private dailyQuestService = new DailyQuestService();

  /**
   * List daily quests suggestions excluding active daily quests by given user
   */
  findAll = async (
    userId: string,
    { limit, sortBy, sortOrder }: QueryParams
  ): Promise<DailyQuestSuggestionModel[]> => {
    const idsToExclude =
      await this.dailyQuestService.getDailyQuestIdsAddedWithSuggestion(userId);

    const suggestions = await prisma.dailyQuestSuggestion.findMany({
      where: {
        id: { notIn: idsToExclude },
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
    });

    return suggestions.map(toDailyQuestSuggestionModel);
  };

  findById = async (id: string): Promise<DailyQuestSuggestionModel> => {
    try {
      const dailyQuestSuggestion =
        await prisma.dailyQuestSuggestion.findFirstOrThrow({
          where: { id },
        });

      return toDailyQuestSuggestionModel(dailyQuestSuggestion);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.NOT_FOUND_CODE) {
          logPrismaKnownError(e);

          throw new NotFoundDomainException({
            message: "There is no daily quest suggestion with the given data",
          });
        }

        throw new UnknownDomainException({
          message: "There is no daily quest suggestion with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  create = async (
    form: CreateDailyQuestSuggestionFormType
  ): Promise<DailyQuestSuggestionModel> => {
    try {
      const dailyQuestSuggestion = await prisma.dailyQuestSuggestion.create({
        data: {
          title: form.title,
          icon: form.icon,
        },
      });

      return toDailyQuestSuggestionModel(dailyQuestSuggestion);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message:
              "A new daily quest suggestion cannot be created with this title and icon",
          });
        }

        throw new UnknownDomainException({
          message: "There is no daily quest suggestion with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  update = async (
    id: string,
    form: UpdateDailyQuestSuggestionFormType
  ): Promise<DailyQuestSuggestionModel> => {
    await validateDailyQuestSuggestionExists(id);

    try {
      const dailyQuestSuggestion = await prisma.dailyQuestSuggestion.update({
        where: { id },
        data: {
          title: form.title,
          icon: form.icon,
        },
      });

      return toDailyQuestSuggestionModel(dailyQuestSuggestion);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new UniqueConstraintDomainException({
          message:
            "Daily quest suggestion with this title and icon already exists",
        });
      }

      throw new UnknownDomainException({
        message: "Failed to update daily quest suggestion",
        context: { e },
      });
    }
  };

  delete = async (id: string): Promise<void> => {
    await validateDailyQuestSuggestionExists(id);

    await prisma.dailyQuestSuggestion.delete({
      where: { id },
    });
  };
}
