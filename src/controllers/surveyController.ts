import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import type { ISurveyService } from "../types.js";

export default class SurveyController {
  constructor(private service: ISurveyService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const survey = await this.service.getBySlug(req.params.slug as string);
    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: survey,
        }),
      );
  };

  createOne = async (req: Request, res: Response, next: NextFunction) => {
    const createdSurvey = await this.service.createOne(req.body);
    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: createdSurvey,
        }),
      );
  };
}
