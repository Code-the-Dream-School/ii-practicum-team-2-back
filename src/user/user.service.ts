import { prisma } from "@/db/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prismaErrorCodes from "@/types/prismaErrorCodes";
import { logPrismaKnownError } from "@/utils/logger";
import {
  ForeignKeyConstraintDomainException,
  UniqueConstraintDomainException,
  UnknownDomainException,
} from "@/errors/domain";
import { User } from "@prisma/client";

class UserService {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserByAuthProvider(provider: string, providerUserId: string): Promise<User | null> {
    const linkedAuth = await prisma.userAuthProvider.findUnique({
      where: {
        provider,
        provider_user_id: providerUserId,
      },
      include: {
        user: true,
      },
    });

    return linkedAuth?.user ?? null;
  }

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

  async createUser(name: string, email: string, passwordHash: string) {
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
  }
}

export const userService = new UserService();
