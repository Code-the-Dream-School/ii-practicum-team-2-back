import { DailyQuestSuggestion as PrismaDailyQuestSuggestion } from "@/generated/prisma";

export interface DailyQuestSuggestionModel {
  id: string;
  title: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

export function toDailyQuestSuggestionModel(
  prismaModel: PrismaDailyQuestSuggestion
): DailyQuestSuggestionModel {
  return {
    id: prismaModel.id,
    title: prismaModel.title,
    icon: prismaModel.icon,
    created_at: prismaModel.created_at,
    updated_at: prismaModel.updated_at,
  };
}
