import type { answersCreateInput } from "../generated/prisma/models.js";
import type AnswerRepository from "../repositories/answerRepository.js";

export default class AnswerService {
  constructor(private repo: AnswerRepository) {}

  getAllFromSurvey = async (surveySlug: string) =>
    await this.repo.getAllFromSurvey(surveySlug);

  createOne = async (answer: answersCreateInput) =>
    await this.repo.createOne(answer);
}
