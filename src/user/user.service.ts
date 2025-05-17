import { prisma } from "@/db/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import { logPrismaKnownError } from "@/utils/logger";
import {
  ForeignKeyConstraintDomainException,
  NotFoundDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
} from "@/errors/domain";
import { User } from "@prisma/client";
import { UserModel } from "@/user/user.domain.types";
import InconsistentColumnDataDomainException from "../errors/domain/inconsistentColumnDataDomain";
import { UpdateUserFormType } from "@/user/user.forms";
import { validateUserExists } from "@/user/user.validators";

export default class UserService {
  findById = async (id: string): Promise<UserModel> => {
    try {
      return await prisma.user.findFirstOrThrow({ where: { id } });
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.NOT_FOUND_CODE) {
          logPrismaKnownError(e);

          throw new NotFoundDomainException({
            message: "There is no user with the given data",
          });
        }

        throw new UnknownDomainException({
          message: "There is no user with the given data",
          context: { e },
        });
      }

      throw e;
    }
  };

  findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };

  async createAuthProvider(
    provider: string,
    providerUserId: string,
    userId: string
  ) {
    try {
      return await prisma.userAuthProvider.create({
        data: {
          provider,
          provider_user_id: providerUserId,
          user_id: userId,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message: "A new user cannot be created with this email",
          });
        }

        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message: "A new user cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message: "Could not create user",
          context: { e },
        });
      }
    }

  }
  
  async findUserByAuthProvider(provider: string, providerUserId: string): Promise<UserModel | null> {
    const linkedAuth = await prisma.userAuthProvider.findUnique({
      where: {
        provider,
        provider_user_id: providerUserId,
      },
      include: {
        user: true,
      },
    });

    if(linkedAuth) {
      return this.findById(linkedAuth.user_id);
    }

    return null;
  }

  createUser = async (name: string, email: string, passwordHash: string) => {
    try {
      return await prisma.user.create({
        data: { name, email, password: passwordHash },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.UNIQUE_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new UniqueConstraintDomainException({
            message: "A new user cannot be created with this email",
          });
        }

        if (e.code === prismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED_CODE) {
          logPrismaKnownError(e);

          throw new ForeignKeyConstraintDomainException({
            message: "A new user cannot be created with this email",
          });
        }

        throw new UnknownDomainException({
          message: "Could not create user",
          context: { e },
        });
      }
    }
  };

  update = async (id: string, form: UpdateUserFormType): Promise<UserModel> => {
    try {
      await validateUserExists(id);

      return await prisma.user.update({
        where: { id },
        data: {
          email: form.email,
          name: form.name,
        },
      });
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === prismaErrorCodes.INCONSISTENT_COLUMN_DATA) {
          logPrismaKnownError(e);

          throw new InconsistentColumnDataDomainException({
            message: "A new user cannot be updated with this email",
          });
        }

        throw new UnknownDomainException({
          message: "Failed to update user",
          context: { e },
        });
      }

      throw e;
    }
  };
}
