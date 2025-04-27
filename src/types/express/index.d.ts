import "express-serve-static-core";
import QueryParams from "@/types/queryParams";
import { Request } from "express";
import RouteParams from "@/types/routeParams";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
    };
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
}

export interface RequestWithQueryParams<
  P = Record<string, string>, // params
  ResBody = Record<string, string>,
  ReqBody = Record<string, string>,
  ReqQuery = Record<string, string>,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  queryParams: QueryParams;
}

export interface RequestWithRouteParams<
  P = Record<string, string>, // params
  ResBody = Record<string, string>,
  ReqBody = Record<string, string>,
  ReqQuery = Record<string, string>,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  routeParams: RouteParams;
}
