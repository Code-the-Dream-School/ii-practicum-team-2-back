import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import { prisma } from "@/db/prisma";
import {
  CreateDailyQuestSuggestionFormType,
  UpdateDailyQuestSuggestionFormType,
} from "@/daily-quest/suggestion/suggestion.forms";

export const validateDailyQuestSuggestionForUpdate = async (
  id: string,
  form: UpdateDailyQuestSuggestionFormType
): Promise<void> => {
  await validateDailyQuestSuggestionExists(id);
  await validateSuggestionHasUniqueTitleAndIcon(form);
};

export const validateDailyQuestSuggestionExists = async (
  id: string
): Promise<void> => {
  const existing = await prisma.dailyQuestSuggestion.findFirst({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundDomainException({
      message: "Daily quest suggestion not found",
    });
  }
};

export const validateSuggestionHasUniqueTitleAndIcon = async (
  form: CreateDailyQuestSuggestionFormType | UpdateDailyQuestSuggestionFormType
): Promise<void> => {
  const existing = await prisma.dailyQuest.findFirst({
    where: { title: form.title, icon: form.icon },
  });

  if (existing) {
    throw new ValidationDomainException({
      context: {
        title: [
          "You cannot create or update Daily quest suggestion with the same title and icon",
        ],
      },
    });
  }
};
