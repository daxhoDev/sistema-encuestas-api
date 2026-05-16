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
import type {
  createUserSchema,
  loginDataSchema,
} from "./schemas/userSchema.js";
import type SurveyRepository from "./repositories/surveyRepository.js";

export interface ISurveyRepository {
  getAll: (queries: QueryString) => Promise<any[]>;
  getBySlug: (slug: string) => Promise<any>;
  createOne: (survey: any) => Promise<any>;
  deleteOneBySlug: (slug: string) => Promise<any>;
  updateOneBySlug: (slug: string, data: any) => Promise<any>;
  getSlugBySlug: (slug: string) => Promise<any>;
  getActivatedAtBySlug: (slug: string) => Promise<any>;
}
export interface ISurveyService {
  getAll: (queries: QueryString) => Promise<any[]>;
  getBySlug: (slug: string) => Promise<any>;
  createOne: (survey: any) => Promise<any>;
  deleteOneBySlug: (slug: string) => Promise<any>;
  updateOneBySlug: (slug: string, data: any) => Promise<any>;
}

export interface IAnswerRepository {
  getAllFromSurvey: (slug: string) => Promise<any[]>;
  getById: (id: string) => Promise<any>;
  createOne: (answer: any) => Promise<any>;
  deleteById: (id: string) => Promise<any>;
  getIpByOriginIp: (ip: string) => Promise<any>;
}
export interface IAnswerService {
  getAllFromSurvey: (slug: string) => Promise<any[]>;
  getById: (id: string) => Promise<any>;
  deleteById: (id: string) => Promise<any>;
  createOne: (answer: any, slug: string) => Promise<any>;
}

export interface IUserRepository {
  createOne: (data: {
    id: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<any>;

  getByEmail: (email: string) => Promise<any>;
  getByUsername: (username: string) => Promise<any>;
}

export interface IAuthService {
  signup: (data: User) => Promise<any>;
  login: Function;
  comparePassword: Function;
}

export type Survey = z.infer<typeof createSurveySchema>;
export type Question = z.infer<typeof questionSchema>;

export type Answer = z.infer<typeof createAnswerSchema>;
export type Response = z.infer<typeof responseSchema>;

export type User = z.infer<typeof createUserSchema>;

export type QueryString = z.infer<typeof queryStringSchema>;

export interface ProtectedRequest extends Request {
  user?: { username: string; email: string };
}

export interface QueryStringRequest extends Request {
  queryData?: QueryString;
}

export type LoginData = z.infer<typeof loginDataSchema>;
