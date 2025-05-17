type User = {
  id: string;
  email: string;
  name: string;
  created_at: Date;
};

export type RegisterResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};
