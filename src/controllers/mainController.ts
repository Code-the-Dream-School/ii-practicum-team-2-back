import { Request, Response } from "express-serve-static-core";
import { CreateUserQueryParams } from "../types/queryParams";
import { ErrorResponse } from "../types/response";
import { createUser } from "../services/userService";
import { CreateUserForm, CreateUserResponse } from "../dtos";

export const get = (req: Request, res: Response) => {
  res.json({ data: "This is a full stack app!" });
};

// This is an example of async action with sanitized body/query fields,
// type hints for request body/query and defined Response types
export const post = async (
  req: Request<unknown, unknown, CreateUserForm, CreateUserQueryParams>,
  res: Response<CreateUserResponse | ErrorResponse>,
) => {
  const { username, email } = req.body;
  console.log(username);
  const password = req.body.password;
  const loginAfterCreate = req.query.loginAfterCreate;
  console.log(loginAfterCreate);

  if (!email || !password) {
    res.status(400).json({ code: 400, name: "Missing credentials" });
  } else {
    const user = await createUser(req.body);

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
};
