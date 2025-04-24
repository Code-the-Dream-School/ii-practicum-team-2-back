import { NotFoundDomainException } from "@/errors/domain";
import { prisma } from "@/db/prisma";

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
