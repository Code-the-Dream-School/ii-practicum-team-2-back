import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "@/types/express";

export default class GoalBoardImageController {
  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  };

  upload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  };
}
