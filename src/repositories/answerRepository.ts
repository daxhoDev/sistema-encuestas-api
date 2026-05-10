import { prisma } from "../lib/prisma.js";

export default class AnswerRepository {
  getAllFromSurvey = async (surveySlug: string) =>
    await prisma.answers.findMany({
      where: {
        surveys: {
          slug: surveySlug,
        },
      },
    });
  // await prisma.$queryRaw`SELECT survey_id, name, questions, responses FROM answers JOIN surveys ON answers.survey_id = surveys.id WHERE slug = ${surveySlug}`;
}
