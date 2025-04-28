import { z } from "zod";
import { Frequency } from "@/types/enums";

const weekdaysOnly: Frequency[] = [
  Frequency.Mondays,
  Frequency.Tuesdays,
  Frequency.Wednesdays,
  Frequency.Thursdays,
  Frequency.Fridays,
  Frequency.Saturdays,
  Frequency.Sundays,
];
const ERROR_INVALID_FREQUENCY =
  "Frequency must be either 'Daily' or at least one weekday, but not both.";

function isFrequencyValid(frequency: Frequency[]) {
  if (frequency.length === 0) {
    return false;
  }

  const hasDaily = frequency.includes(Frequency.Daily);
  const hasWeekdays = frequency.some((frequency) =>
    weekdaysOnly.includes(frequency)
  );

  return !(hasDaily && hasWeekdays);
}

export const CreateDailyQuestForm = z
  .object({
    title: z.string().min(3).max(256),
    icon: z.string().min(1).max(64),
    goal_id: z.string().uuid().nullable().optional(),
    suggestion_id: z.string().uuid().nullable().optional(),
    frequency: z
      .array(z.nativeEnum(Frequency))
      .min(1, "Select at least one frequency"),
  })
  .refine((data) => isFrequencyValid(data.frequency), {
    message: ERROR_INVALID_FREQUENCY,
    path: ["frequency"],
  });
export type CreateDailyQuestFormType = z.infer<typeof CreateDailyQuestForm>;

export const UpdateDailyQuestForm = z
  .object({
    title: z.string().min(3).max(256),
    icon: z.string().min(1).max(64),
    frequency: z
      .array(z.nativeEnum(Frequency))
      .min(1, "Select at least one frequency"),
  })
  .refine((data) => isFrequencyValid(data.frequency), {
    message: ERROR_INVALID_FREQUENCY,
    path: ["frequency"],
  });
export type UpdateDailyQuestFormType = z.infer<typeof UpdateDailyQuestForm>;
