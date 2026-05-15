import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import type {
  ISurveyService,
  QueryString,
  QueryStringRequest,
} from "../types.js";
import { date } from "zod";

export default class SurveyController {
  constructor(private service: ISurveyService) {}

  async getAll(req: QueryStringRequest, res: Response, next: NextFunction) {
    const queries = req.queryData;
    console.log(req.queryData);

    const surveys = await this.service.getAll(queries as QueryString);
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
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
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
  }

  async createOne(req: Request, res: Response, next: NextFunction) {
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
  }

  async deleteOneBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    await this.service.deleteOneBySlug(slug);

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

  async updateOneBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const data = req.body;
    const updatedSurvey = await this.service.updateOneBySlug(slug, data);

    res
      .type("json")
      .status(200)
      .send(
        json({
          status: "success",
          data: updatedSurvey,
        }),
      );
  }
}
