import { RequestHandler, Router } from "express";
import UserController from "./user.controller";
import { auth } from "@/middleware/authentication";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/profile", auth, userController.getProfile as RequestHandler);
userRouter.patch(
  "/profile",
  auth,
  userController.updateProfile as RequestHandler
);

export default userRouter;
