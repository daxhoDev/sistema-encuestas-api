import type { answersCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { IAnswerRepository } from "../types.js";

export default class AnswerRepository implements IAnswerRepository {
  getAllFromSurvey = async (surveySlug: string) =>
    await prisma.answers.findMany({
      where: {
        surveys: {
          slug: surveySlug,
        },
        deleted_at: null
      },
    });

  getById = async (id: number) =>
    await prisma.answers.findUnique({
      where: {
        id,
        deleted_at: null
      },
      include: {
        surveys: {
          select: {
            name: true,
            questions: true,
          },
        },
      },
    });

  createOne = async (answer: answersCreateInput) =>
    await prisma.answers.create({ data: answer });
}
