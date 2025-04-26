import { z } from "zod";

export const CreateGoalProgressForm = z.object({
  goal_type_field_id: z.string().uuid(),
  progress_value: z.number().int().nonnegative(),
});

export type CreateGoalProgressFormType = z.infer<typeof CreateGoalProgressForm>;
