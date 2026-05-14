import z from "zod";

export const responseSchema = z.strictObject(
  {
    id: z.number("Each response.id must be an integer"),
    content: z
      .string(
        "Each response.content must be a string, a number or a string of numbers",
      )
      .or(z.number().or(z.array(z.number()))),
  },
  "Each response must be an object",
);

export const createAnswerSchema = z.strictObject(
  {
    survey_id: z.number("survey_id must be an integer"),
    responses: z.array(responseSchema, "responses must be an array"),
    origin_ip: z.ipv4("origin_ip must be a valid IP (ipv4) address"),
  },
  "Invalid answer",
);

export type CreateAnswerSchema = z.infer<typeof createAnswerSchema>;
