import type { surveysCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { ISurveyRepository } from "../types.js";

export default class SurveyRepository implements ISurveyRepository {
  getAll: ISurveyRepository["getAll"] = async (search, active, date) => {
    const where: any = {};

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
      const start = new Date(date);
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
    await prisma.surveys.findFirst({ where: { slug } });

  createOne: ISurveyRepository["createOne"] = async (survey) =>
    await prisma.surveys.create({ data: survey });
}
