import { DailyQuestSuggestionModel } from "@/daily-quest/suggestion/suggestion.domain.types";

export interface DailyQuestSuggestionResponse {
  id: string;
  title: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export const toDailyQuestSuggestionResponse = (
  model: DailyQuestSuggestionModel
): DailyQuestSuggestionResponse => ({
  id: model.id,
  title: model.title,
  icon: model.icon,
  created_at: model.created_at.toISOString(),
  updated_at: model.updated_at.toISOString(),
});

export const toDailyQuestSuggestionResponses = (
  models: DailyQuestSuggestionModel[]
): DailyQuestSuggestionResponse[] => models.map(toDailyQuestSuggestionResponse);
