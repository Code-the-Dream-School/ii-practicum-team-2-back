import { prisma } from "@/db/prisma";
import { NotFoundDomainException } from "@/errors/domain";
import { UserModel } from "@/user/user.domain.types";

export const validateUserExists = async (id: string): Promise<UserModel> => {
  const user = await prisma.user.findFirst({ where: { id } });

  if (!user) {
    throw new NotFoundDomainException({
      message: "User not found",
      context: { id },
    });
  }

  return user;
};
