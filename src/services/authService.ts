import z from "zod";
import type { IUserRepository, User } from "../types.js";
import { createUserSchema } from "../schemas/userSchema.js";
import bcrypt from "bcrypt";

export default class AuthService {
  constructor(private repo: IUserRepository) {}

  async signup(data: User) {
    const {
      success,
      data: serializedData,
      error,
    } = z.safeParse(createUserSchema, data);

    if (!success) {
      throw error;
    }

    const encryptedPassword = await bcrypt.hash(serializedData.password, 10);

    return await this.repo.createOne({
      email: serializedData.email,
      username: serializedData.username,
      password: encryptedPassword,
    });
  }
}
