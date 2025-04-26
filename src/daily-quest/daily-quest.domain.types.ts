import { Frequency } from "@/types/enums";
import { DailyQuest as PrismaDailyQuest } from "@/generated/prisma";

export interface DailyQuestModel {
  id: string;
  user_id: string;
  goal_id: string | null;
  suggestion_id: string | null;
  title: string;
  icon: string;
  frequency: Frequency[];
  created_at: Date;
  updated_at: Date;
}

export interface DailyQuestWithCompletionModel extends DailyQuestModel {
  daily_quest_completions: {
    completed_at: Date;
  }[];
}

export interface DailyQuestCompletionModel {
  id: string;
  daily_quest_id: string;
  user_id: string;
  date: Date;
  completed_at: Date;
}

export function toDailyQuestModel(
  prismaModel: PrismaDailyQuest
): DailyQuestModel {
  return {
    id: prismaModel.id,
    user_id: prismaModel.user_id,
    goal_id: prismaModel.goal_id,
    suggestion_id: prismaModel.suggestion_id,
    title: prismaModel.title,
    icon: prismaModel.icon,
    frequency: prismaModel.frequency as Frequency[],
    created_at: prismaModel.created_at,
    updated_at: prismaModel.updated_at,
  };
}
