import z from "zod";
import type { surveysCreateInput } from "../generated/prisma/models.js";
import {
  createSurveySchema,
  updateSurveySchema,
} from "../schemas/surveySchema.js";
import type {
  ISurveyRepository,
  ISurveyService,
  QueryString,
  Survey,
} from "../types.js";
import AppError from "../utils/appError.js";
import slugify from "slugify";

export default class SurveyService implements ISurveyService {
  constructor(private repo: ISurveyRepository) {}

  async getAll(queries: QueryString) {
    return await this.repo.getAll(queries);
  }

  async getBySlug(slug: string) {
    const survey = await this.repo.getBySlug(slug);
    if (!survey) {
      throw new AppError(`Survey not found`, 404);
    }
    return survey;
  }

  async createOne(survey: surveysCreateInput) {
    const result = z.safeParse(createSurveySchema, survey);
    if (!result.success) throw result.error;

    const slug = slugify(survey.name, { lower: true, strict: true });
    const slugExists = await this.repo.getBySlug(slug);

    if (slugExists) {
      throw new AppError(`This survey name is not avaliable`, 400);
    }

    const serializedData = { ...result.data, slug };
    await this.repo.createOne(serializedData);
  }

  async deleteOneBySlug(slug: string) {
    return await this.repo.deleteOneBySlug(slug);
  }

  async updateOneBySlug(slug: string, data: Survey) {
    const {
      success,
      data: serializedData,
      error,
    } = z.safeParse(updateSurveySchema, data);

    if (!success) throw error;

    const newSlug = serializedData.name
      ? slugify(serializedData.name, { lower: true, strict: true })
      : slug;

    let slugExists = false;
    if (slug !== newSlug) {
      slugExists = await this.repo.getBySlug(newSlug);
    }

    if (slugExists) {
      throw new AppError(`This survey name is not avaliable`, 400);
    }

    return await this.repo.updateOneBySlug(slug, {
      ...serializedData,
      slug: newSlug,
      updated_at: new Date(),
    });
  }
}
