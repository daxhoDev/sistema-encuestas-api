import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { json } from "../utils/json.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export default class SurveyController {
  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const surveys = await prisma.surveys.findMany();
      res
        .type("json")
        .status(200)
        .send(
          json({
            status: "success",
            results: surveys.length,
            data: surveys,
          }),
        );
    },
  );

  getById = catchAsync(async (req, res, next) => {
    const survey = await prisma.surveys.findUnique({
      where: {
        id: BigInt(req.params.surveyId as string),
      },
    });
    if (!survey) {
      throw new AppError(`Survey not found`, 404);
    }
    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: survey,
        }),
      );
  });
}
