import { RequestHandler, Router } from "express";
import AuthController from "./auth.controller";
import { auth } from "@/middleware/authentication";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/google-login", authController.googleLogin);
authRouter.post("/logout", auth, authController.logout as RequestHandler);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/password-reset/request", authController.requestPasswordReset);
authRouter.post("/password-reset/confirm", authController.confirmPasswordReset);

export default authRouter;
