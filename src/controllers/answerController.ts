import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import type { IAnswerService } from "../types.js";

export default class AnswerController {
  constructor(private service: IAnswerService) {}

  getAllFromSurvey = async (req: Request, res: Response) => {
    const answers = await this.service.getAllFromSurvey(
      req.params.slug as string,
    );
    res
      .status(200)
      .type("json")
      .send(
        json({ status: "success", results: answers.length, data: answers }),
      );
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const answer = await this.service.getById(id);

    res
      .type("json")
      .status(200)
      .send(json({ status: "success", data: answer }));
  };

  createOne = async (req: Request, res: Response) => {
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
  };

  deleteById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.service.deleteById(id);

    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: [],
        }),
      );
  };
}
