import z from "zod";
import type { answersCreateInput } from "../generated/prisma/models.js";
import { createAnswerSchema } from "../schemas/answerSchema.js";
import AppError from "../utils/appError.js";
import {
  QuestionType,
  type IAnswerRepository,
  type IAnswerService,
  type ISurveyRepository,
  type Question,
  type Response,
} from "../types.js";

export default class AnswerService implements IAnswerService {
  constructor(
    private answerRepo: IAnswerRepository,
    private surveyRepo: ISurveyRepository,
  ) {}

  getAllFromSurvey = async (surveySlug: string) =>
    await this.answerRepo.getAllFromSurvey(surveySlug);

  createOne = async (answer: answersCreateInput, slug: string) => {
    const referencedSurvey = await this.surveyRepo.getBySlug(slug);

    // Validar el schema
    const {
      success,
      error,
      data: serializedData,
    } = z.safeParse(createAnswerSchema, {
      ...answer,
      survey_id: referencedSurvey.id,
    });
    if (!success) throw error;

    const responses: Response[] = serializedData.responses;
    const questions: Question[] = referencedSurvey.questions;

    if (responses.length !== questions.length) {
      throw new AppError(
        "Debe haber una respuesta para cada pregunta de la encuesta",
        400,
      );
    }

    //TODO: fix comparison
    if (
      !responses
        .map((response: Response) => response.id)
        .every((responseId) =>
          questions.map((question) => question.id).includes(responseId),
        )
    ) {
      console.log(
        responses
          .map((response: Response) => response.id)
          .every((responseId) =>
            questions.map((question) => question.id).includes(responseId),
          ),
      );
      throw new AppError(
        "Los ids de las respuestas deben corresponderse con los de las preguntas",
        400,
      );
    }

    if (
      responses.reduce((acc, response, i) => {
        if (
          questions[i]?.type === QuestionType.multiSelect ||
          questions[i]?.type === QuestionType.singleSelect
        ) {
          return (
            (acc && questions[i].options?.includes(response.content)) || false
          );
        }
        return acc && true;
      }, true)
    ) {
      throw new AppError(
        "Las respuestas de las preguntas de selección deben ser una de las opciones provistas en la pregunta",
        400,
      );
    }

    return await this.answerRepo.createOne(serializedData);
  };
}
