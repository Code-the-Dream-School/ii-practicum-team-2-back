import { parseQueryParams } from "@/utils/queryParams";
import type { NextFunction, Request, Response } from "express";
import { QueryParamsRawSchema } from "@/types/queryParams";
import { BadRequestError } from "@/errors/http";

/**
 * Take care of all needed params according to the QueryParamsRawSchema are being parsed from query params and are valid
 */
export function queryParamsParser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const parsed = QueryParamsRawSchema.safeParse(req.query);

  if (!parsed.success) {
    throw new BadRequestError({
      message: parsed.error.errors.map((e) => e.message).join("; "),
    });
  }

  req.queryParams = parseQueryParams(parsed.data);

  next();
}
