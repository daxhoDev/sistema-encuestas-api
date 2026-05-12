import z from "zod";

export const queryStringSchema = z.strictObject(
  {
    active: z
      .enum(["true", "false"], "active debe ser true o false")
      .transform((value) =>
        value === "true" ? true : value === "false" ? false : value,
      )
      .optional(),
    search: z.string("search debe ser un string").optional(),
    date: z
      .string()
      .regex(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Fecha inválida, usa DD/MM/AAAA",
      )
      .transform((value) => {
        const [day, month, year] = value.split("/").map(Number);
        return new Date(year as number, (month as number) - 1, day as number);
      })
      .optional(),
  },
  "Elementos permitidos en la query string: 'active', 'date' y 'search'",
);
