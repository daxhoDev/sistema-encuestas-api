import z from "zod";

export const createUserSchema = z
  .strictObject({
    email: z.email("email must be a valid email"),
    username: z.string("username must be a string"),
    password: z
      .string("password must be a string")
      .min(5, "password must have at least 5 characters"),
    passwordConfirm: z.string("passwordConfirm must be a string"),
  })
  .refine(
    (data) => data.passwordConfirm === data.password,
    "password and passwordConfirm must be the same",
  );

export const loginDataSchema = z.strictObject({
  email: z.email("email must be a valid email"),
  password: z.string("password must be a string"),
});
