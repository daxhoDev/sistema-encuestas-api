import type { NextFunction, Response } from "express";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import z from "zod";
import { jwtSchema } from "../schemas/authSchema.js";
import type { ProtectedRequest } from "../types.js";

export default class AuthMiddleware {
  async protect(req: ProtectedRequest, res: Response, next: NextFunction) {
    const { jwt } = req.cookies;

    if (!jwt) {
      throw new AppError("Please, log in first", 401);
    }

    const { success, data: validToken, error } = z.safeParse(jwtSchema, jwt);
    if (!success) {
      throw error;
    }

    const decoded = jwt.verify(
      validToken,
      process.env.JWT_SECRET as string,
    ) as { username: string; email: string };

    req.user = decoded;

    next();
  }
}
