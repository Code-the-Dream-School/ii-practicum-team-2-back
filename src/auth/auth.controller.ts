import type { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import { AuthenticatedRequest } from "@/types/express";

const authService = new AuthService();

export default class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    
    res.status(StatusCodes.CREATED).json(result);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    res.status(StatusCodes.OK).json(result);
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    const result = await authService.googleLogin(req.body.id_token);

    res.status(StatusCodes.OK).json(result);
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    const { refresh_token } = req.body;
    const result = await authService.logout(refresh_token);

    res.status(StatusCodes.NO_CONTENT).json(result);
  }

  async refreshToken(req: Request, res: Response) {
    const result = await authService.refreshToken(req.body.refresh_token);
    
    res.status(StatusCodes.OK).json(result);
  }

  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  }

  async confirmPasswordReset(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({ message: "It works!" });
  }
}
