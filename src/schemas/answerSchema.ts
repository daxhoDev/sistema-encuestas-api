import z from "zod";

export const createAnswerSchema = z.strictObject(
  {
    survey_id: z.number("survey_id debe ser un número entero"),
    responses: z.array(
      z.object({
        id: z.number("Los id de las respuestas deben ser números enteros"),
        content: z.string("El contenido de cada respuesta debe ser un string"),
      }),
      "responses debe ser un array",
    ),
    origin_ip: z
      .string("origin_ip debe ser un string")
      .min(5, "origin_ip demasiado corto"),
  },
  {
    error: "Respuesta inválida",
  },
);
