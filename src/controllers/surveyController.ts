import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { json } from "../utils/json.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import type SurveyService from "../services/surveyService.js";

export default class SurveyController {
  constructor(private service: SurveyService) {}
  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const surveys = await this.service.getAll();
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

  getBySlug = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const survey = await this.service.getBySlug(req.params.slug as string);
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
    },
  );
}
