import { z } from "zod";
import { FieldType } from "@/types/enums";

export const GoalTypeFieldForm = z
  .object({
    field_name: z.string(),
    field_type: z.nativeEnum(FieldType),
    required: z.boolean(),
    trackable: z.boolean().optional(),
    options: z.array(z.string()).nullable().optional(),
  })
  .refine(
    (data) => data.field_type !== FieldType.Dropdown || !!data.options?.length,
    {
      message: "Options must be provided when field_type is 'dropdown'",
      path: ["options"],
    }
  );
export type GoalTypeFieldFormType = z.infer<typeof GoalTypeFieldForm>;

export const CreateGoalTypeForm = z.object({
  name: z.string(),
  description: z.string(),
  goal_type_fields: z.array(GoalTypeFieldForm).min(1),
});
export type CreateGoalTypeFormType = z.infer<typeof CreateGoalTypeForm>;

export const UpdateGoalTypeForm = z.object({
  name: z.string(),
  description: z.string(),
});
export type UpdateGoalTypeFormType = z.infer<typeof UpdateGoalTypeForm>;
