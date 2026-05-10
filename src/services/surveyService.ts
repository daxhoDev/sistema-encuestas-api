import type { surveysCreateInput } from "../generated/prisma/models.js";
import type SurveyRepository from "../repositories/surveyRepository.js";

export default class SurveyService {
  constructor(private repo: SurveyRepository) {}
  getAll = async () => await this.repo.getAll();

  getBySlug = async (slug: string) => await this.repo.getBySlug(slug);

  createOne = async (survey: surveysCreateInput) =>
    await this.repo.createOne(survey);
}
