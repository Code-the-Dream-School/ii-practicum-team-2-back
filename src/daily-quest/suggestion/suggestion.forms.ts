import { z } from "zod";

export const DailyQuestSuggestionForm = z.object({
  title: z.string().min(3).max(256),
  icon: z.string().min(1).max(64),
});

export const CreateDailyQuestSuggestionForm = DailyQuestSuggestionForm;
export type CreateDailyQuestSuggestionFormType = z.infer<
  typeof CreateDailyQuestSuggestionForm
>;

export const UpdateDailyQuestSuggestionForm = DailyQuestSuggestionForm;
export type UpdateDailyQuestSuggestionFormType = z.infer<
  typeof UpdateDailyQuestSuggestionForm
>;
