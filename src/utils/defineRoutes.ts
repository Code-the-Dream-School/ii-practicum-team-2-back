import { Express } from "express";

import userRouter from "@/user/user.routes";
import authRouter from "@/auth/auth.routes";
import goalRouter from "@/goal/goal.routes";
import goalBoardImageRouter from "@/goal-board-image/goal-board-image.routes";
import goalTypeRouter from "@/goal-type/goal-type.routes";
import goalProgressRouter from "@/goal-progress/goal-progress.routes";
import dailyQuestRouter from "@/daily-quest/daily-quest.routes";
import dailyQuestSuggestionRouter from "@/daily-quest/suggestion/suggestion.routes";

export const defineRoutes = (app: Express) => {
  app.use("/api/v1/users", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/goals", goalRouter);
  app.use("/api/v1/goal-board-images", goalBoardImageRouter);
  app.use("/api/v1/goal-types", goalTypeRouter);
  app.use("/api/v1/goals", goalProgressRouter);
  app.use("/api/v1/daily-quests/suggestions", dailyQuestSuggestionRouter);
  app.use("/api/v1/daily-quests", dailyQuestRouter);
};
