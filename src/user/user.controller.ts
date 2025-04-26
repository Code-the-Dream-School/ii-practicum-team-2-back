import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "@/types/express";

export default class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  }
}
