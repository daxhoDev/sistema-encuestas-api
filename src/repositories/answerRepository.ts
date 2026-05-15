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

  async getById(id: string) {
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
    return await prisma.answers.create({ data: answer });
  }

  async deleteById(id: string) {
    return await prisma.answers.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getIpByOriginIp(ip: string) {
    return await prisma.answers.findUnique({
      where: {
        origin_ip: ip,
      },
      select: {
        origin_ip: true,
      },
    });
  }
}
