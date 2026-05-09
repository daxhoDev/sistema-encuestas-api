import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.js";

export class ErrorController {
  globalErrorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
      this.sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
      this.sendErrorProd(err, res);
    }
  };

  sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  };

  sendErrorProd = (err: AppError, res: Response) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  };
}
