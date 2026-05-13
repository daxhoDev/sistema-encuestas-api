import type { answersCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { IAnswerRepository } from "../types.js";

export default class AnswerRepository implements IAnswerRepository {
  getAllFromSurvey: IAnswerRepository["getAllFromSurvey"] = async (
    surveySlug,
  ) =>
    await prisma.answers.findMany({
      where: {
        surveys: {
          slug: surveySlug,
        },
        deleted_at: null,
      },
    });

  getById: IAnswerRepository["getById"] = async (id) =>
    await prisma.answers.findUnique({
      where: {
        id,
        deleted_at: null,
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

  createOne: IAnswerRepository["createOne"] = async (answer) =>
    await prisma.answers.create({ data: answer });

  deleteById: IAnswerRepository["deleteById"] = async (id) =>
    await prisma.answers.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
}
