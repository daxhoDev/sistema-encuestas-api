import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.js";
import { ZodError } from "zod";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";

export class ErrorController {
  handleZodError(err: ZodError) {
    const message = Array.from(new Set(err.issues.map((i) => i.message))).join(
      ". ",
    );
    return new AppError(message, 400);
  }

  globalErrorHandler = (
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
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
}
