import type { surveysCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";

export default class SurveyRepository {
  getAll = async () => await prisma.surveys.findMany();

  getBySlug = async (slug: string) =>
    await prisma.surveys.findFirst({ where: { slug } });

  createOne = async (survey: surveysCreateInput) =>
    await prisma.surveys.create({ data: survey });
}
