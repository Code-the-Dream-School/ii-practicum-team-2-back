import { z } from "zod";

export const QueryParamsRawSchema = z.object({
  limit: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isInteger(num) && num >= 1 && num <= 50;
      },
      {
        message: "Limit must be an integer between 1 and 50",
      }
    )
    .optional(),

  sort: z.string().optional(),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO format (YYYY-MM-DD)",
    })
    .optional(),
});

export type RawQueryParams = z.infer<typeof QueryParamsRawSchema>;

export enum SortingOrder {
  ASC = "asc",
  DESC = "desc",
}

type QueryParams = {
  limit: number;
  sortBy: string;
  sortOrder: SortingOrder;
  date?: Date;
};

export default QueryParams;
