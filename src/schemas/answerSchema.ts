import z from "zod";

export const createAnswerSchema = z.strictObject(
  {
    survey_id: z.number("survey_id must be an integer"),
    responses: z.array(
      z.object(
        {
          id: z.number("Each response.id must be an integer"),
          content: z.string("Each response.content must be a string"),
        },
        "Each response must be an object",
      ),
      "responses must be an array",
    ),
    origin_ip: z.ipv4("origin_ip must be a valid IP address"),
  },
  "Invalid answer",
);
