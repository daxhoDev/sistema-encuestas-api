import z from "zod";
import type { surveysCreateInput } from "../generated/prisma/models.js";
import { createSurveySchema } from "../schemas/surveySchema.js";
import type { ISurveyRepository, ISurveyService } from "../types.js";
import AppError from "../utils/appError.js";
import slugify from "slugify";

export default class SurveyService implements ISurveyService {
  constructor(private repo: ISurveyRepository) {}

  getAll = async (status?: boolean) => await this.repo.getAll(status);

  getBySlug = async (slug: string) => {
    const survey = await this.repo.getBySlug(slug);
    if (!survey) {
      throw new AppError(`Survey not found`, 404);
    }
    return survey;
  };

  createOne = async (survey: surveysCreateInput) => {
    const result = z.safeParse(createSurveySchema, survey);
    if (!result.success) throw result.error;

    const slug = slugify(survey.name, { lower: true, strict: true });
    const surveyExists = await this.repo.getBySlug(slug);

    if (surveyExists) {
      throw new AppError(`This survey name is not avaliable`, 400);
    }

    const serializedData = { ...result.data, slug };
    await this.repo.createOne(serializedData);
  };
}
