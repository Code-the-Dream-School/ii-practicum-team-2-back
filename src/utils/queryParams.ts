import QueryParams, { RawQueryParams, SortingOrder } from "@/types/queryParams";
import { parse } from "date-fns";

export const parseQueryParams = (query: RawQueryParams): QueryParams => {
  const limitRaw = query.limit ?? "10";
  const limit = parseInt(limitRaw, 10);

  const sortRaw = query.sort ?? "created_at";
  const sortField = sortRaw.replace(/^-/, "");
  const sortOrder = sortRaw.startsWith("-")
    ? SortingOrder.DESC
    : SortingOrder.ASC;

  const date = query.date
    ? parse(query.date, "yyyy-MM-dd", new Date())
    : undefined;

  return {
    limit,
    sortBy: sortField,
    sortOrder,
    date,
  };
};
