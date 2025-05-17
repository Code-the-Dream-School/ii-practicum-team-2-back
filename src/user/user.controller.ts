import type { Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "@/types/express";
import { NotFoundDomainException } from "@/errors/domain";
import { NotFoundError, UnprocessableEntityError } from "@/errors/http";
import UserService from "@/user/user.service";
import { UserModel } from "@/user/user.domain.types";
import { toUserResponse } from "@/user/user.types";
import { UpdateUserForm } from "@/user/user.forms";

export default class UserController {
  private userService: UserService = new UserService();

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const user: UserModel = await this.userService.findById(req.user.id);

      res.status(StatusCodes.OK).json(toUserResponse(user));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };

  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const updateUserForm = UpdateUserForm.safeParse(req.body);
    if (!updateUserForm.success) {
      throw new UnprocessableEntityError({
        errors: updateUserForm.error.flatten().fieldErrors,
      });
    }

    try {
      const user: UserModel = await this.userService.update(
        req.user.id,
        updateUserForm.data
      );

      res.status(StatusCodes.OK).json(toUserResponse(user));
    } catch (e: unknown) {
      if (e instanceof NotFoundDomainException) {
        throw new NotFoundError({ message: e.message });
      }

      throw e;
    }
  };
}
