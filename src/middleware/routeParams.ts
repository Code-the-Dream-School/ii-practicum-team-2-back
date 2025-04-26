import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/errors/http";
import { RouteParamsRawSchema } from "@/types/routeParams";

/**
 * Take care of id is being parsed from route params and is a valid UUID v4
 */
export function routeParamsParser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const parsed = RouteParamsRawSchema.safeParse(req.params);

  if (!parsed.success) {
    throw new BadRequestError({
      message: parsed.error.errors.map((e) => e.message).join("; "),
    });
  }

  req.routeParams = { id: parsed.data.id };

  next();
}
