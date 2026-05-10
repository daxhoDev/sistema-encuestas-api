import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import { json } from "../utils/json.js";
import type AnswerService from "../services/answerService.js";

export default class AnswerController {
  constructor(private answerService: AnswerService) {}

  getAllFromSurvey = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const answers = await this.answerService.getAllFromSurvey(
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
    async (req: Request, res: Response, next: NextFunction) => {},
  );
}
