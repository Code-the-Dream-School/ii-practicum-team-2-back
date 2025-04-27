import { Router } from "express";
import UserController from "./user.controller";
import { auth } from "@/middleware/authentication";
import { asyncController } from "@/utils/controller";
import { AuthenticatedRequest } from "@/types/express";

const userRouter = Router();
const userController = new UserController();

userRouter.get(
  "/profile",
  auth,
  asyncController<AuthenticatedRequest>(userController.getProfile)
);
userRouter.patch(
  "/profile",
  auth,
  asyncController<AuthenticatedRequest>(userController.updateProfile)
);

export default userRouter;
