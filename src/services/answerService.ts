import type AnswerRepository from "../repositories/answerRepository.js";

export default class AnswerService {
  constructor(private answerRepository: AnswerRepository) {}

  getAllFromSurvey = async (surveySlug: string) =>
    await this.answerRepository.getAllFromSurvey(surveySlug);
}
