import type { surveysCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { ISurveyRepository, QueryString, Survey } from "../types.js";

export default class SurveyRepository implements ISurveyRepository {
  defaultTake = 10;
  defaultSkip = 0;

  async getAll({ search, active, date, page, limit }: QueryString) {
    const where: any = {
      deleted_at: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (active !== undefined) {
      where.is_active = active;
    }

    if (date) {
      const start = date;
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      where.created_at = {
        gte: start,
        lt: end,
      };
    }

    return await prisma.surveys.findMany({
      where,
      take: limit ? limit : this.defaultTake,
      skip: page ? (page - 1) * this.defaultTake : this.defaultSkip,
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getBySlug(slug: string) {
    return await prisma.surveys.findFirst({
      where: { slug, deleted_at: null },
    });
  }

  async createOne(survey: any) {
    return await prisma.surveys.create({ data: survey });
  }

  async deleteOneBySlug(slug: string) {
    return await prisma.surveys.update({
      where: { slug },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async updateOneBySlug(slug: string, data: any) {
    return await prisma.surveys.update({
      where: { slug },
      data,
    });
  }

  async getSlugBySlug(slug: string) {
    return await prisma.surveys.findUnique({
      where: { slug, deleted_at: null },
      select: { slug: true },
    });
  }

  async getActivatedAtBySlug(slug: string) {
    return await prisma.surveys.findUnique({
      where: { slug, deleted_at: null },
      select: {
        activated_at: true,
      },
    });
  }
}
