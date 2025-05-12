import { z } from "zod";

export const UpdateUserForm = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  name: z.string().min(3, { message: "'name' is required" }),
});
export type UpdateUserFormType = z.infer<typeof UpdateUserForm>;
