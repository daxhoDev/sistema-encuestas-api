import z from "zod";
import type { answersCreateInput } from "../generated/prisma/models.js";
import type { IAnswerRepository, IAnswerService } from "../types.js";
import { createAnswerSchema } from "../schemas/answerSchema.js";

export default class AnswerService implements IAnswerService {
  constructor(private repo: IAnswerRepository) {}

  getAllFromSurvey = async (surveySlug: string) =>
    await this.repo.getAllFromSurvey(surveySlug);

  createOne = async (answer: answersCreateInput) => {
    //implementar lógica
    const { success, error, data } = z.safeParse(createAnswerSchema, answer);
    if (!success) throw error;
    return await this.repo.createOne(data);
  };
}
