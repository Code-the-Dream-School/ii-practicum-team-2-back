import { prisma } from "@/db/prisma";
import QueryParams from "@/types/queryParams";
import GoalTypeModel, {
  GoalTypeDetailedModel,
  GoalTypeFieldModel,
  toGoalTypeDetailedModel,
  toGoalTypeFieldModel,
} from "@/goal-type/goal-type.domain.types";
import {
  ForeignKeyConstraintDomainException,
  NotFoundDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
} from "@/errors/domain";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logPrismaKnownError } from "@/utils/logger";
import {
  CreateGoalTypeFormType,
  GoalTypeFieldFormType,
  UpdateGoalTypeFormType,
} from "@/goal-type/goal-type.forms";
import { validateGoalTypeExists } from "@/goal-type/goal-type.validators";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import InconsistentColumnDataDomainException from "../errors/domain/inconsistentColumnDataDomain";

export default class GoalTypeService {
  findAll = async ({
    limit,
    sortBy,
    sortOrder,
  }: QueryParams): Promise<GoalTypeModel[]> => {
    return prisma.goalType.findMany({
      orderBy: { [sortBy]: sortOrder },
      take: limit,
    });
  };

  findById = async (id: string): Promise<GoalTypeDetailedModel> => {
    try {
      const goalModel = await prisma.goalType.findFirstOrThrow({
        where: { id },
        include: { goal_type_fields: true },
      });

      return toGoalTypeDetailedModel(goalModel);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.NOT_FOUND_CODE) {
          logPrismaKnownError(e);

          throw new NotFoundDomainException({
            message: "There is no goal type with the given data",
          });
        }

        throw new UnknownDomainException({
          message: "There is no goal type with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  create = async (
    form: CreateGoalTypeFormType
  ): Promise<GoalTypeDetailedModel> => {
    try {
      const goalModel = await prisma.goalType.create({
        data: {
          name: form.name,
          description: form.description,
          goal_type_fields: {
            create: form.goal_type_fields.map((field) => ({
              field_name: field.field_name,
              field_type: field.field_type,
              required: field.required,
              trackable: field.trackable ?? false,
              options: field.options ?? [],
            })),
          },
        },
        include: {
          goal_type_fields: true,
        },
      });

      return toGoalTypeDetailedModel(goalModel);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message: "A new goal type cannot be created with this name",
          });
        }
        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message: "A new goal type cannot be created with this name",
          });
        }
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new goal cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message: "There is no goal type with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  update = async (
    id: string,
    form: UpdateGoalTypeFormType
  ): Promise<GoalTypeDetailedModel> => {
    try {
      await validateGoalTypeExists(id);

      const updatedModel = await prisma.goalType.update({
        where: { id },
        data: {
          name: form.name,
          description: form.description,
        },
        include: {
          goal_type_fields: true,
        },
      });

      return toGoalTypeDetailedModel(updatedModel);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new goal cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message: "Failed to update goal",
          context: { e },
        });
      }

      throw e;
    }
  };

  delete = async (id: string): Promise<void> => {
    await validateGoalTypeExists(id);

    await prisma.goalType.delete({
      where: { id },
    });
  };

  addFields = async (
    goalTypeId: string,
    fields: GoalTypeFieldFormType[]
  ): Promise<GoalTypeFieldModel[]> => {
    await validateGoalTypeExists(goalTypeId);

    const freshFields = await prisma.$transaction(async (tx) => {
      const createGoalTypeFieldValues = fields.map((f) =>
        tx.goalTypeField.create({
          data: {
            goal_type_id: goalTypeId,
            field_name: f.field_name,
            field_type: f.field_type,
            required: f.required,
            options: f.options ?? [],
            trackable: f.trackable ?? false,
          },
        })
      );

      return await Promise.all(createGoalTypeFieldValues);
    });

    return freshFields.map(toGoalTypeFieldModel);
  };
}
