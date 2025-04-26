import { prisma } from "@/db/prisma";
import { CreateGoalProgressFormType } from "./goal-progress.forms";
import { GoalProgressModel } from "./goal-progress.domain.types";
import QueryParams from "@/types/queryParams";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import { logPrismaKnownError } from "@/utils/logger";
import {
  ForeignKeyConstraintDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
} from "@/errors/domain";
import { validateGoalProgressCreationInput } from "@/goal-progress/goal-progress.validators";
import InconsistentColumnDataDomainException from "../errors/domain/inconsistentColumnDataDomain";

export default class GoalProgressService {
  findAll = async (
    userId: string,
    goalId: string,
    { limit, sortBy, sortOrder }: QueryParams
  ): Promise<GoalProgressModel[]> => {
    return prisma.goalProgress.findMany({
      where: { user_id: userId, goal_id: goalId },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
    });
  };

  create = async (
    userId: string,
    goalId: string,
    form: CreateGoalProgressFormType
  ): Promise<GoalProgressModel> => {
    try {
      await validateGoalProgressCreationInput(goalId, userId, form);

      return await prisma.goalProgress.create({
        data: {
          goal_id: goalId,
          user_id: userId,
          goal_type_field_id: form.goal_type_field_id,
          progress_value: form.progress_value,
        },
      });
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message: "A new goal progress cannot be created with this email",
          });
        }
        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message: "A new goal progress cannot be created with this email",
          });
        }
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new goal cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message: "There is no goal progress with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };
}
