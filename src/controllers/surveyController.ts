import type { NextFunction, Request, Response } from "express";
import { json } from "../utils/json.js";
import type { ISurveyService, ProtectedRequest } from "../types.js";
import { queryStringSchema } from "../schemas/queryStringsSchema.js";
import z from "zod";

export default class SurveyController {
  constructor(private service: ISurveyService) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    const { success, data, error } = z.safeParse(queryStringSchema, req.query);
    if (!success) throw error;

    const queries = data;

    const surveys = await this.service.getAll(queries);
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

  async createOne(req: ProtectedRequest, res: Response, next: NextFunction) {
    console.log(req.user);
    const createdSurvey = await this.service.createOne(req.body);

    res
      .type("json")
      .status(201)
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
      .status(204)
      .send(
        json({
          status: "success",
          data: [],
        }),
      );
  }

  async updateOneBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const body = req.body;
    const updatedSurvey = await this.service.updateOneBySlug(slug, body);

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
