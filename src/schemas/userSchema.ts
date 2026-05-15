import z from "zod";

export const createUserSchema = z
  .object({
    email: z.email("email must be a valid email"),
    username: z.string("username must be a string"),
    password: z
      .string("password must be a string")
      .min(5, "password must have at least 5 characters"),
    password_confirm: z.string("password must be a string"),
  })
  .refine(
    (data) => data.password_confirm === data.password,
    "password and password_confirm must be the same",
  );
