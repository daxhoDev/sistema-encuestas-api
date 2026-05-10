import type { surveysCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type { ISurveyRepository } from "../types.js";

export default class SurveyRepository implements ISurveyRepository {
  getAll = async () => await prisma.surveys.findMany();

  getBySlug = async (slug: string) =>
    await prisma.surveys.findFirst({ where: { slug } });

  createOne = async (survey: surveysCreateInput) =>
    await prisma.surveys.create({ data: survey });
}
