import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import { json } from "../utils/json.js";
import type AnswerService from "../services/answerService.js";
import z from "zod";
import { createAnswerSchema } from "../schemas/answerSchema.js";
import SurveyController from "./surveyController.js";

export default class AnswerController {
  constructor(private service: AnswerService) {}

  getAllFromSurvey = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const answers = await this.service.getAllFromSurvey(
        req.params.slug as string,
      );
      res
        .status(200)
        .type("json")
        .send(
          json({ status: "success", results: answers.length, data: answers }),
        );
    },
  );

  createOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const rawData = req.body;
      const surveySlug = req.params.slug;

      //TODO: Obtener el survey y validar responses

      const serializedData = z.parse(createAnswerSchema, rawData);

      const data = await this.service.createOne(req.body);
    },
  );
}
