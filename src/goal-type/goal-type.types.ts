import GoalTypeModel, {
  GoalTypeDetailedModel,
  GoalTypeFieldModel,
} from "@/goal-type/goal-type.domain.types";
import { FieldType } from "@/types/enums";

export interface GoalTypeResponse {
  id: string;
  name: string;
  description: string;
}

export interface GoalTypeDetailedResponse {
  id: string;
  name: string;
  description: string;
  goal_type_fields: GoalTypeFieldResponse[];
}

export interface GoalTypeFieldResponse {
  id: string;
  goal_type_id: string;
  field_name: string;
  field_type: FieldType;
  required: boolean;
  options?: string[] | null;
  trackable?: boolean | null;
}

export const toGoalTypeDetailedResponse = (
  model: GoalTypeDetailedModel
): GoalTypeDetailedResponse => ({
  id: model.id,
  name: model.name,
  description: model.description,
  goal_type_fields: model.goal_type_fields.map((field) => ({
    id: field.id,
    goal_type_id: field.goal_type_id,
    field_name: field.field_name,
    field_type: field.field_type,
    required: field.required,
    options: field.options,
    trackable: field.trackable,
  })),
});

export const toGoalTypeResponse = (model: GoalTypeModel): GoalTypeResponse => ({
  id: model.id,
  name: model.name,
  description: model.description,
});

export const toGoalTypeResponseList = (
  list: GoalTypeModel[]
): GoalTypeResponse[] => list.map(toGoalTypeResponse);

export function toGoalTypeFieldResponse(
  field: GoalTypeFieldModel
): GoalTypeFieldResponse {
  return {
    id: field.id,
    goal_type_id: field.goal_type_id,
    field_name: field.field_name,
    field_type: field.field_type,
    required: field.required,
    options: field.options ?? null,
    trackable: field.trackable,
  };
}

export function toGoalTypeFieldResponseList(
  fields: GoalTypeFieldModel[]
): GoalTypeFieldResponse[] {
  return fields.map(toGoalTypeFieldResponse);
}
