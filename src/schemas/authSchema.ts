import z from "zod";

export const jwtSchema = z.jwt("Invalid token, please log in again");
