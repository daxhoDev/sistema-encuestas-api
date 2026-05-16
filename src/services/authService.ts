import z from "zod";
import type {
  IUserRepository,
  IAuthService,
  LoginData,
  User,
} from "../types.js";
import { createUserSchema, loginDataSchema } from "../schemas/userSchema.js";
import bcrypt from "bcrypt";
import { v7 } from "uuid";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

export default class AuthService implements IAuthService {
  constructor(private repo: IUserRepository) {}

  async signup(data: User) {
    const {
      success,
      data: validData,
      error,
    } = z.safeParse(createUserSchema, data);

    if (!success) {
      throw error;
    }

    const emailExists = await this.repo.getByEmail(validData.email);
    if (emailExists) {
      throw new AppError("There is already an user with this email", 400);
    }
    const usernameExists = await this.repo.getByUsername(validData.username);
    if (usernameExists) {
      throw new AppError("There is already an user with this username", 400);
    }

    const id = v7();
    const encryptedPassword = await bcrypt.hash(validData.password, 10);

    const user = await this.repo.createOne({
      id,
      email: validData.email,
      username: validData.username,
      password: encryptedPassword,
    });
    const token = this.createSignedJwt(id, validData.email, validData.username);

    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    };
  }

  async login(data: LoginData) {
    const {
      success,
      error,
      data: validData,
    } = z.safeParse(loginDataSchema, data);

    if (!success) {
      throw error;
    }

    const user = await this.repo.getByEmail(validData.email);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const passwordIsCorrect = await this.comparePassword(
      validData.password,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new AppError("Incorrect password", 401);
    }

    const token = this.createSignedJwt(user.id, user.email, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }

  async comparePassword(candidatePassword: string, correctPassword: string) {
    const isCorrect = await bcrypt.compare(candidatePassword, correctPassword);
    return isCorrect;
  }

  createSignedJwt(id: string, email: string, username: string) {
    const token = jwt.sign(
      {
        id,
        email,
        username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
      },
    );
    return token;
  }
}
