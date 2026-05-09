import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { prisma } from "../lib/prisma.js";
import { json } from "../utils/json.js";

export default class AnswerController {
  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const answers = await prisma.answers.findMany({
        where: { survey_id: Number(req.params.surveyId) },
      });
      res
        .status(200)
        .type("json")
        .send(
          json({ status: "success", results: answers.length, data: answers }),
        );
    },
  );
}
