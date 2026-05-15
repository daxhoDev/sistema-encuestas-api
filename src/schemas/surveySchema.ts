import { z } from "zod";

const surveyNameSchema = z
  .string("Survey name must be a string")
  .nonempty("Survey name can't be empty")
  .min(5, "Survey name is too short");

export const questionSchema = z.strictObject(
  {
    id: z
      .number("question.id must be an integer")
      .min(1, "question.id must be greater than 0"),
    name: z
      .string("Question name must be a string")
      .nonempty("Question can't be empty")
      .min(5, "Question name is too short"),
    type: z.enum(
      {
        singleSelect: "SINGLE_SELECT",
        multiSelect: "MULTI_SELECT",
        textAnswer: "TEXT_ANSWER",
      },
      "Survey type must be SINGLE_SELECT, MULTI_SELECT or TEXT_ANSWER",
    ),
    options: z
      .array(
        z.strictObject(
          {
            id: z
              .int("questions.options.id must be an integer")
              .min(1, "questions.options.id must be a positive number"),
            content: z
              .string("questions.options.content must be a string")
              .nonempty("questions.options.content can't be empty"),
          },
          "questions.options must be an array",
        ),
        "questions must be an array",
      )
      .nonempty(`An options array can't be empty`)
      .optional(),
    is_required: z.boolean("is_required must be a boolean"),
  },
  "Invalid question format",
);

const questionArrSchema = z
  .array(
    questionSchema.refine((data) => {
      if (data.type === "SINGLE_SELECT" || data.type === "MULTI_SELECT") {
        return data.options;
      }
      return !data.options;
    }, "If question type is a SELECT type there must be options"),
    { error: "Questions must be an array" },
  )
  .nonempty("Questions array can't be empty");

export const createSurveySchema = z.strictObject(
  {
    name: surveyNameSchema,
    questions: questionArrSchema,
  },
  "Invalid format",
);

export const updateSurveySchema = z.object({
  name: surveyNameSchema.optional(),
  questions: questionArrSchema.optional(),
  is_active: z.boolean("is_active must be a boolean").optional(),
});
