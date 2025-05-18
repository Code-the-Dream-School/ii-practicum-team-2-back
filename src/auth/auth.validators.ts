import { UnauthenticatedError, UnprocessableEntityError } from "@/errors/http";
import bcrypt from "bcryptjs";
import UserService from "@/user/user.service";
import { TokenPayload } from "google-auth-library";

const userService: UserService = new UserService();

export const validateExistingUser = async (email: string) => {
  const existingUser = await userService.findUserByEmail(email);

  if (existingUser) {
    throw new UnprocessableEntityError({
      message: "User already exists",
      errors: {
        email: ["User with this email already exists"],
      },
    });
  }
};

export const validateUserPassword = async (
  formValue: string,
  userPassword: string
) => {
  const isMatch = bcrypt.compare(formValue, userPassword);

  if (!isMatch) {
    throw new UnprocessableEntityError({
      message: "Invalid email or password",
      errors: {
        email: ["Invalid email or password"],
      },
    });
  }
};

export const validateGooglePayload = (payload: TokenPayload | undefined) => {
  if (!payload || !payload.email || !payload.sub || !payload.name) {
    throw new UnauthenticatedError({
      message: "Invalid Google token payload",
    });
  }
}
