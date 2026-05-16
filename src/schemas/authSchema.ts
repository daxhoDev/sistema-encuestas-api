import z from "zod";

export const jwtSchema = z.jwt("Invalid JWT");

export const payloadSchema = z.strictObject(
  {
    id: z.uuidv7("Invalid id"),
  },
  "Invalid data",
);
