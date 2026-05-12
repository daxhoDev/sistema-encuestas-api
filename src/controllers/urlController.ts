import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { queryStringSchema } from "../schemas/queryStringsSchema.js";
import type { QueryString, QueryStringRequest } from "../types.js";

export default class UrlController {
  validateQueryStrings = (
    req: QueryStringRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { active, search, date } = req.query;

    const { success, data, error } = z.safeParse(queryStringSchema, {
      active: active === "true" ? true : active === "false" ? false : undefined,
      search,
      date: date ? new Date(date as string) : undefined,
    });

    if (!success) throw error;

    req.data = data as QueryString;
    next();
  };
}
