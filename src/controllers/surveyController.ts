import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import type SurveyService from "../services/surveyService.js";
import type { Survey } from "../types.js";
import slugify from "slugify";
import type { surveysCreateInput } from "../generated/prisma/models.js";
import type { InputJsonValue } from "@prisma/client/runtime/client";
import z, { ZodError } from "zod";
import { createSurveySchema } from "../schemas/surveySchema.js";

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

  createOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const survey = req.body;
      const result = z.safeParse(createSurveySchema, survey);
      if (!result.success) throw result.error;

      const slug = slugify(survey.name, { lower: true, strict: true });
      const surveyExists = await this.service.getBySlug(slug);
      if (surveyExists) {
        throw new AppError(`Survey name not avaliable`, 400);
      }

      const serializedData = { ...result.data, slug };

      const data = await this.service.createOne(serializedData);

      res
        .type("json")
        .status(200)
        .send(
          json({
            status: "success",
            data,
          }),
        );
    },
  );
}
