import {
  NotFoundDomainException,
  ValidationDomainException,
} from "@/errors/domain";
import {
  CreateDailyQuestFormType,
  UpdateDailyQuestFormType,
} from "@/daily-quest/daily-quest.forms";
import { prisma } from "@/db/prisma";

export const validateDailyQuestForCreate = async (
  userId: string,
  form: CreateDailyQuestFormType | UpdateDailyQuestFormType
): Promise<void> => {
  await validateGoalExists(userId, form);
  await validateSuggestionExists(form);
  await validateDailyQuestWithTitleDoesntExists(userId, form);
};

export const validateDailyQuestForUpdate = async (
  id: string,
  userId: string,
  form: UpdateDailyQuestFormType
): Promise<void> => {
  await validateDailyQuestExists(id, userId);
  await validateDailyQuestWithTitleDoesntExists(userId, form);
};

export const validateGoalExists = async (
  userId: string,
  form: CreateDailyQuestFormType
): Promise<void> => {
  if (form.goal_id) {
    const goal = await prisma.goal.findFirst({
      where: { id: form.goal_id, user_id: userId },
    });

    if (!goal) {
      throw new NotFoundDomainException({
        message: "Associated goal not found or does not belong to the user",
      });
    }
  }
};

export const validateSuggestionExists = async (
  form: CreateDailyQuestFormType
): Promise<void> => {
  if (form.suggestion_id) {
    const suggestion = await prisma.dailyQuestSuggestion.findFirst({
      where: { id: form.suggestion_id },
    });

    if (!suggestion) {
      throw new NotFoundDomainException({
        message: "Associated daily quest suggestion not found",
      });
    }
  }
};

export const validateDailyQuestExists = async (
  id: string,
  userId: string
): Promise<void> => {
  const existing = await prisma.dailyQuest.findFirst({
    where: { id, user_id: userId },
  });

  if (!existing) {
    throw new NotFoundDomainException({
      message: "Daily quest not found",
    });
  }
};

export const validateDailyQuestWithTitleDoesntExists = async (
  userId: string,
  form: CreateDailyQuestFormType | UpdateDailyQuestFormType
): Promise<void> => {
  const existing = await prisma.dailyQuest.findFirst({
    where: { title: form.title, user_id: userId },
  });

  if (existing) {
    throw new ValidationDomainException({
      context: {
        title: ["You cannot create or update Daily quest with the same title"],
      },
    });
  }
};
