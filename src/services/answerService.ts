import z from "zod";
import type { answersCreateInput } from "../generated/prisma/models.js";
import { createAnswerSchema } from "../schemas/answerSchema.js";
import AppError from "../utils/appError.js";
import {
  type Answer,
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

  getById = async (id: number) => await this.answerRepo.getById(id);

  createOne = async (answer: answersCreateInput, slug: string) => {
    const referencedSurvey = await this.surveyRepo.getBySlug(slug);

    const {
      success,
      error,
      data: serializedData,
    } = z.safeParse(createAnswerSchema, {
      ...answer,
      survey_id: Number(referencedSurvey.id),
    });
    if (!success) throw error;

    const responses: Response[] = serializedData.responses;
    const questions: Question[] = referencedSurvey.questions;
    const requiredQuestions = questions.filter((q) => q.is_required);
    const responseIdArr = responses.map((r) => r.id);

    // Validate correct responses array size
    if (
      responses.length < requiredQuestions.length ||
      responses.length > questions.length
    ) {
      throw new AppError("There are missing or exceeding responses", 400);
    }

    // Validate there are no wrong id's
    // if (
    //   !responseIdArr.every((responseId) =>
    //     questions.map((q) => q.id).includes(responseId),
    //   )
    // ) {
    //   throw new AppError("Each response id must match a question id", 400);
    // }

    // if (
    //   !requiredQuestions
    //     .map((q) => q.id)
    //     .every((questionId) => responseIdArr.includes(questionId))
    // ) {
    //   // Validate all required questions are responded
    //   throw new AppError("All required questions must be responded", 400);
    // }

    // // Validate there are no repeated id's
    // if (responseIdArr.length !== new Set(responseIdArr).size) {
    //   throw new AppError("Each response id must be unique", 400);
    // }

    // // Validate diferent question types are correctly responded
    // if (
    //   !responses.reduce((acc, response) => {
    //     const matchingQuestion = questions.find((q) => q.id === response.id);

    //     if (matchingQuestion?.type === "SINGLE_SELECT") {
    //       return (
    //         (acc &&
    //           matchingQuestion?.options
    //             ?.map((o) => o.id)
    //             .includes(response.content as number)) ||
    //         false
    //       );
    //     }

    //     if (matchingQuestion?.type === "MULTI_SELECT") {
    //       return (
    //         (acc &&
    //           matchingQuestion?.options
    //             ?.map((o) => o.id)
    //             .every((optionId) =>
    //               (response.content as number[]).includes(optionId),
    //             )) ||
    //         false
    //       );
    //     }

    //     if (matchingQuestion?.type === "TEXT_ANSWER") {
    //       return typeof response.content === "string";
    //     }

    //     return acc;
    //   }, true)
    // ) {
    //   throw new AppError(
    //     `Incorrect response content: SINGLE_SELECT responses must be an id, MULTI_SELECT responses must be an array of id's, TEXT_ANSWER responses must be a string`,
    //     400,
    //   );
    // }

    let message = "";
    if (
      !responses.every((response) => {
        const matchingQuestion = questions.find((q) => q.id === response.id);

        if (matchingQuestion?.type === "SINGLE_SELECT") {
          if (
            typeof response.content !== "number" ||
            !matchingQuestion?.options
              ?.map((o) => o.id)
              .includes(response.content)
          ) {
            message =
              "The response content for a SINGLE_SELECT question must be an option id";
            return false;
          }
        }

        if (matchingQuestion?.type === "MULTI_SELECT") {
          if (
            !(response.content instanceof Array) ||
            !response.content.every((responseId) =>
              matchingQuestion.options?.map((o) => o.id).includes(responseId),
            )
          ) {
            message =
              "The response content for a MULTI_SELECT question must be an array of valid option id's";
            console.log(response, matchingQuestion);
            return false;
          }
        }

        if (matchingQuestion?.type === "TEXT_ANSWER") {
          if (typeof response.content !== "string") {
            message =
              "The response content for a TEXT_ANSWER question must be string";
            return false;
          }
        }

        return true;
      })
    ) {
      throw new AppError(message, 400);
    }

    return await this.answerRepo.createOne(serializedData);
  };

  deleteById: IAnswerService["deleteById"] = async (id) => {
    await this.answerRepo.deleteById(id);
  };
}
