import type { surveysCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { ISurveyRepository } from "../types.js";

export default class SurveyRepository implements ISurveyRepository {
  getAll: ISurveyRepository["getAll"] = async ({
    search,
    active,
    date,
    page,
  }) => {
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

    return await prisma.surveys.findMany({ where });
  };

  getBySlug: ISurveyRepository["getBySlug"] = async (slug) =>
    await prisma.surveys.findFirst({ where: { slug, deleted_at: null } });

  createOne: ISurveyRepository["createOne"] = async (survey) =>
    await prisma.surveys.create({ data: survey });

  deleteOneBySlug: ISurveyRepository["deleteOneBySlug"] = async (slug) =>
    await prisma.surveys.update({
      where: { slug },
      data: {
        deleted_at: new Date(),
      },
    });
}
