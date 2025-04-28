import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Turn an async fn whose req is your own typed Request
 * into a full Express RequestHandler (with proper error bubbling).
 */
export function asyncController<TReq extends Request>(
  fn: (req: TReq, res: Response) => Promise<void>
): RequestHandler {
  return (req, res, next: NextFunction) => {
    fn(req as unknown as TReq, res).catch(next);
  };
}
