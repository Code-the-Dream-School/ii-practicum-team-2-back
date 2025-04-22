import { GoalModel } from "@/goal/goal.domain.types";

export interface GoalResponse {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  goal_type_id: string;
  created_at: string;
  updated_at: string;
  goal_field_values: GoalFieldValueResponse[];
}

export interface GoalFieldValueResponse {
  id: string;
  goal_type_field_id: string;
  goal_id: string;
  user_id: string;
  value: string;
}

export function toGoalResponse(goal: GoalModel): GoalResponse {
  return {
    id: goal.id,
    name: goal.name,
    description: goal.description,
    user_id: goal.user_id,
    goal_type_id: goal.goal_type_id,
    created_at: goal.created_at.toISOString(),
    updated_at: goal.updated_at.toISOString(),
    goal_field_values: goal.goal_field_values.map((m) => ({
      id: m.id,
      goal_type_field_id: m.goal_type_field_id,
      goal_id: m.goal_id,
      user_id: m.user_id,
      value: m.value,
    })),
  };
}

export function toGoalResponses(goals: GoalModel[]): GoalResponse[] {
  return goals.map(toGoalResponse);
}

//
// export interface GoalFieldValueDTO {
//   id: string;
//   goal_type_field_id: string;
//   goal_id: string;
//   user_id: string;
//   value: string;
// }
//
// export interface GoalRequestForm {
//   name: string;
//   description?: string;
//   goal_type_id: string;
//   goal_field_values: GoalFieldValueDTO[];
// }
//
// export type UpdateGoalFieldValuesRequest = GoalFieldValueDTO[];
