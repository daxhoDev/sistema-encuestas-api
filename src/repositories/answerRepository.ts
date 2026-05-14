import type { answersCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { IAnswerRepository } from "../types.js";

export default class AnswerRepository implements IAnswerRepository {
  async getAllFromSurvey(surveySlug: string) {
    return await prisma.answers.findMany({
      where: {
        surveys: {
          slug: surveySlug,
        },
        deleted_at: null,
      },
    });
  }

  async getById(id: number) {
    return await prisma.answers.findUnique({
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
  }

  async createOne(answer: any) {
    await prisma.answers.create({ data: answer });
  }

  async deleteById(id: number) {
    return await prisma.answers.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
