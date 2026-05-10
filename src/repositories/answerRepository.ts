import type { answersCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";

export default class AnswerRepository {
  getAllFromSurvey = async (surveySlug: string) =>
    await prisma.answers.findMany({
      where: {
        surveys: {
          slug: surveySlug,
        },
      },
    });

  createOne = async (answer: answersCreateInput) =>
    await prisma.answers.create({ data: answer });
}
