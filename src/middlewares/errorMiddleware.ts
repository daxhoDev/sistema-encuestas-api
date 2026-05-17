import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.js";
import z, { ZodError } from "zod";
import { type TokenExpiredError } from "jsonwebtoken";

export class ErrorMiddleware {
  handleZodError(err: ZodError) {
    const message = Array.from(new Set(err.issues.map((i) => i.message))).join(
      ". ",
    );

    console.log(err.issues);

    const statusCode = err.issues[0]?.format === "jwt" ? 401 : 400;
    return new AppError(message, statusCode);
  }

  handleJwtExpiredError(err: TokenExpiredError) {
    const message = `This token expired at ${err.expiredAt}, please log in again`;
    return new AppError(message, 400);
  }

  handleGlobalError = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err instanceof ZodError) {
      err = this.handleZodError(err);
    }
    if (err.name === "TokenExpiredError") {
      err = this.handleJwtExpiredError(err);
    }

    console.error("ERROR 💥", err);
    if (process.env.NODE_ENV === "development") {
      this.sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
      this.sendErrorProd(err, res);
    }
  };

  sendErrorDev(err: AppError, res: Response) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  sendErrorProd(err: AppError, res: Response) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
}
