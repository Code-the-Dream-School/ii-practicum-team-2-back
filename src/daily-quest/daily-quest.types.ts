import { Frequency } from "@/types/enums";
import {
  DailyQuestModel,
  DailyQuestWithCompletionModel,
} from "@/daily-quest/daily-quest.domain.types";

export interface DailyQuestResponse {
  id: string;
  user_id: string;
  goal_id: string | null;
  suggestion_id: string | null;
  title: string;
  icon: string;
  frequency: Frequency[];
  created_at: string;
  updated_at: string;
}

export interface DailyQuestForDateResponse {
  id: string;
  user_id: string;
  goal_id: string | null;
  suggestion_id: string | null;
  title: string;
  icon: string;
  frequency: Frequency[];
  created_at: string;
  updated_at: string;
  completed: boolean;
  completed_at: string | null;
}

export const toDailyQuestResponse = (
  model: DailyQuestModel
): DailyQuestResponse => ({
  id: model.id,
  user_id: model.user_id,
  goal_id: model.goal_id,
  suggestion_id: model.goal_id,
  title: model.title,
  icon: model.icon,
  frequency: model.frequency,
  created_at: model.created_at.toISOString(),
  updated_at: model.updated_at.toISOString(),
});
export const toDailyQuestResponseList = (
  models: DailyQuestModel[]
): DailyQuestResponse[] => models.map(toDailyQuestResponse);

export const toDailyQuestForDateResponse = (
  model: DailyQuestWithCompletionModel
): DailyQuestForDateResponse => ({
  id: model.id,
  user_id: model.user_id,
  goal_id: model.goal_id,
  suggestion_id: model.goal_id,
  title: model.title,
  icon: model.icon,
  frequency: model.frequency,
  created_at: model.created_at.toISOString(),
  updated_at: model.updated_at.toISOString(),
  completed: model.daily_quest_completions?.length > 0,
  completed_at:
    model.daily_quest_completions?.[0]?.completed_at?.toISOString() || null,
});

export const toDailyQuestForDateResponseList = (
  models: DailyQuestWithCompletionModel[]
): DailyQuestForDateResponse[] => models.map(toDailyQuestForDateResponse);
