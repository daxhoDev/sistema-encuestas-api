import z from "zod";
import type { queryStringSchema } from "./schemas/queryStringsSchema.js";
import type { Request } from "express";
import {
  questionSchema,
  type createSurveySchema,
} from "./schemas/surveySchema.js";
import type {
  createAnswerSchema,
  responseSchema,
} from "./schemas/answerSchema.js";

export interface ISurveyRepository {
  getAll: (queries: QueryString) => Promise<any[]>;
  getBySlug: (slug: string) => Promise<any>;
  createOne: (survey: any) => Promise<any>;
  deleteOneBySlug: (slug: string) => Promise<any>;
  updateOneBySlug: (slug: string, data: any) => Promise<any>;
  getSlugBySlug: (slug: string) => Promise<any>;
}
export interface ISurveyService extends Partial<ISurveyRepository> {}

export interface IAnswerRepository {
  getAllFromSurvey: (slug: string) => Promise<any[]>;
  getById: (id: number) => Promise<any>;
  createOne: (answer: any) => Promise<any>;
  deleteById: (id: number) => Promise<any>;
}

export interface IAnswerService extends Omit<IAnswerRepository, "createOne"> {
  createOne: (answer: any, slug: string) => Promise<any>;
}

export type Survey = z.infer<typeof createSurveySchema>;
export type Question = z.infer<typeof questionSchema>;

export type Answer = z.infer<typeof createAnswerSchema>;
export type Response = z.infer<typeof responseSchema>;

export type QueryString = z.infer<typeof queryStringSchema>;

export interface QueryStringRequest extends Request {
  queryData?: QueryString;
}
