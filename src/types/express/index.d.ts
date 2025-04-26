import "express-serve-static-core";
import QueryParams from "@/types/queryParams";
import { Request } from "express";
import RouteParams from "@/types/routeParams";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
    };
    queryParams?: QueryParams;
    routeParams?: RouteParams;
  }
}

export interface AuthenticatedRequest<
  P = Record<string, string>, // params
  ResBody = Record<string, string>,
  ReqBody = Record<string, string>,
  ReqQuery = Record<string, string>,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: {
    id: string;
  };
  queryParams?: QueryParams;
  routeParams?: RouteParams;
}
