import z from "zod";

export const queryStringSchema = z.strictObject(
  {
    active: z
      .enum(["true", "false"], "Query string 'active' must be a boolean")
      .transform((value) =>
        value === "true" ? true : value === "false" ? false : value,
      )
      .optional(),
    search: z.string("Query string 'search' must be a string").optional(),
    date: z
      .string()
      .regex(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Query string 'date' format must be DD/MM/YYYY",
      )
      .transform((value) => {
        const [day, month, year] = value.split("/").map(Number);
        return new Date(year as number, (month as number) - 1, day as number);
      })
      .optional(),
    page: z
      .int("Query string 'page' must be an integer")
      .min(1, "Query string 'page' must be a positive number")
      .optional(),
  },
  "Allowed queries at url: 'active', 'date', 'search' and 'page'",
);
