import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { queryStringSchema } from "../schemas/queryStringsSchema.js";
import type { QueryStringRequest } from "../types.js";

export default class UrlController {
  validateQueryStrings(
    req: QueryStringRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { success, data, error } = z.safeParse(queryStringSchema, req.query);
    if (!success) throw error;
    req.queryData = data;
    next();
  }
}
