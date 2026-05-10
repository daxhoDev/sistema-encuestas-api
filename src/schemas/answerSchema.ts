import z from "zod";

export const createAnswerSchema = z.object({
  survey_id: z.int64("survey_id debe ser un número entero"),
  responses: z.array(
    z.object({
      id: z.int64("Los id de las respuestas deben ser números enteros"),
      content: z.string("El contenido de cada respuesta debe ser un string"),
    }),
    "responses debe ser un array",
  ),
});
