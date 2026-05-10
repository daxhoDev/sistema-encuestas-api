import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { json } from "../utils/json.js";
import type { IAnswerService } from "../types.js";

export default class AnswerController {
  constructor(private service: IAnswerService) {}

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
      const createdAnswer = await this.service.createOne(
        req.body,
        req.params.slug as string,
      );
      res
        .status(200)
        .type("json")
        .send(
          json({
            status: "success",
            data: createdAnswer,
          }),
        );
    },
  );
}
