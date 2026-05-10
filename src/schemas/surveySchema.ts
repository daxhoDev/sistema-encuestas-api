import { z } from "zod";

export const createSurveySchema = z.object({
  name: z
    .string("Survey name must be a string")
    .nonempty("Survey name can't be empty")
    .min(5, "Survey name is too short"),
  questions: z.array(
    z
      .object(
        {
          name: z
            .string("Question name must be a string")
            .nonempty("Question can't be empty")
            .min(5, "Question name is too short"),
          type: z.enum(
            ["SINGLE_SELECT", "MULTI_SELECT", "TEXT_ANSWER"],
            "Survey type must be SINGLE_SELECT, MULTI_SELECT or TEXT_ANSWER",
          ),
          options: z
            .array(
              z
                .string("The options must be strings")
                .nonempty("An option can't be empty"),
              "Question options must be an array",
            )
            .nonempty(`An options array can't be empty`)
            .optional(),
          isRequired: z.boolean("isRequired must me a boolean").default(false),
        },
        "Each question must be an object",
      )
      .refine((data) => {
        if (data.type === "SINGLE_SELECT" || data.type === "MULTI_SELECT") {
          return data.options;
        }
        return !data.options;
      }, "If question type is a SELECT type there must be options"),
    { error: "Questions must be an array" },
  ),
});
