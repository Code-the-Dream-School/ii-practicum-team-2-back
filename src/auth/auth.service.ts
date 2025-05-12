import { jwtTokenService } from "@/services/JwtTokenService";
import { UnauthenticatedError, UnprocessableEntityError } from "@/errors/http";
import {
  LoginForm,
  loginFormSchema,
  RegistrationForm,
  registrationFormSchema,
} from "./auth.forms";
import { validateExistingUser, validateUserPassword } from "./auth.validators";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma";
import { LoginResponse, RegisterResponse } from "./auth.types";
import UserService from "@/user/user.service";

export class AuthService {
  private userService: UserService = new UserService();

  async register(
    data: RegistrationForm
  ): Promise<RegisterResponse | undefined> {
    const result = registrationFormSchema.safeParse(data);

    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password, name } = data;

    await validateExistingUser(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.createUser(
      name,
      email,
      hashedPassword
    );

    if (newUser) {
      const tokenPair = jwtTokenService.generateTokenPair({
        userId: newUser.id,
      });

      await prisma.refreshToken.create({
        data: {
          user_id: newUser.id,
          token: tokenPair.refreshToken,
          expires_at: jwtTokenService.getRefreshTokenExpirationDate(),
        },
      });

      return {
        access_token: tokenPair.accessToken,
        refresh_token: tokenPair.refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          created_at: newUser.created_at,
        },
      };
    }
  }

  async login(data: LoginForm): Promise<LoginResponse> {
    const result = loginFormSchema.safeParse(data);

    if (!result.success) {
      throw new UnprocessableEntityError({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = data;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnprocessableEntityError({
        message: "Invalid email or password",
        errors: {
          email: ["Invalid email or password"],
        },
      });
    }
    await validateUserPassword(password, user.password);

    const { accessToken, refreshToken } = jwtTokenService.generateTokenPair({
      userId: user.id,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthenticatedError({ message: "Missing refresh token" });
    }

    let payload;
    try {
      payload = jwtTokenService.verifyRefreshToken(token);
    } catch {
      throw new UnauthenticatedError({
        message: "Invalid or expired refresh token",
      });
    }

    const oldToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    await prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });

    if (!oldToken || oldToken.revoked || oldToken.expires_at < new Date()) {
      throw new UnauthenticatedError({
        message: "Invalid or expired refresh token",
      });
    }

    const { accessToken: access_token, refreshToken: refresh_token } =
      jwtTokenService.generateTokenPair({
        userId: payload.userId,
      });

    await prisma.refreshToken.create({
      data: {
        user_id: payload.userId,
        token: refresh_token,
        expires_at: jwtTokenService.getRefreshTokenExpirationDate(),
      },
    });

    return { access_token, refresh_token };
  }
}
