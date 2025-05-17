import { UserModel } from "@/user/user.domain.types";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export function toUserResponse(user: UserModel): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at.toISOString(),
  };
}
