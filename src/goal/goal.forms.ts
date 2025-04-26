import { z } from "zod";

export const GoalFieldValueForm = z.object({
  goal_type_field_id: z.string().uuid(),
  value: z.string(),
});
export const CreateGoalForm = z.object({
  name: z.string().min(3).max(256),
  description: z.string().min(3).max(1024),
  goal_type_id: z.string().uuid(),
  goal_field_values: z.array(GoalFieldValueForm).min(1),
});
export type GoalRequestFormType = z.infer<typeof CreateGoalForm>;

export const UpdateGoalForm = z.object({
  name: z.string().min(3).max(256),
  description: z.string().min(3).max(1024),
});
export type UpdateGoalFormType = z.infer<typeof UpdateGoalForm>;

export const UpdateGoalFieldValuesForm = z.array(GoalFieldValueForm);
export type UpdateGoalFieldValuesType = z.infer<
  typeof UpdateGoalFieldValuesForm
>;
