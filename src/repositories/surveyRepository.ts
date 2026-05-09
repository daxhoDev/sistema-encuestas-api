import { prisma } from "../lib/prisma.js";

export default class SurveyRepository {
  getAll = async () => await prisma.surveys.findMany();

  getBySlug = async (slug: string) =>
    await prisma.surveys.findFirst({ where: { slug } });
}
