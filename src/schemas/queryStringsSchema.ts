import z from "zod";

export const queryStringSchema = z.object({
  active: z.boolean("active debe ser un booleano").optional(),
  search: z.string("search debe ser un string").optional(),
  date: z.date("date debe ser una fecha válida").optional(),
});
