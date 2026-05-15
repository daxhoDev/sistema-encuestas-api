import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import type { IAnswerService } from "../types.js";

export default class AnswerController {
  constructor(private service: IAnswerService) {}

  async getAllFromSurvey(req: Request, res: Response) {
    const answers = await this.service.getAllFromSurvey(
      req.params.slug as string,
    );
    res
      .status(200)
      .type("json")
      .send(
        json({ status: "success", results: answers.length, data: answers }),
      );
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    const answer = await this.service.getById(id as string);

    res
      .type("json")
      .status(200)
      .send(json({ status: "success", data: answer }));
  }

  async createOne(req: Request, res: Response) {
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
  }

  async deleteById(req: Request, res: Response) {
    const id = req.params.id;
    await this.service.deleteById(id as string);

    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: [],
        }),
      );
  }
}
