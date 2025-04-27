import { GoalProgressModel } from "@/goal-progress/goal-progress.domain.types";

export interface GoalProgressResponse {
  id: string;
  goal_id: string;
  goal_type_field_id: string;
  user_id: string;
  progress_value: number;
  created_at: string;
}

export const toGoalProgressResponse = (
  model: GoalProgressModel
): GoalProgressResponse => ({
  id: model.id,
  goal_id: model.goal_id,
  goal_type_field_id: model.goal_type_field_id,
  user_id: model.user_id,
  progress_value: model.progress_value,
  created_at: model.created_at.toISOString(),
});

export const toGoalProgressResponseList = (
  list: GoalProgressModel[]
): GoalProgressResponse[] => list.map(toGoalProgressResponse);
