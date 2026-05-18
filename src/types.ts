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

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
// REPOSITORIES
export interface ISurveyRepository {
  getAll(queries: QueryString): Promise<Survey[]>;
  getBySlug(slug: string): Promise<Survey | null>;
  createOne(
    survey: CreateSurveyData & { id: string; slug: string },
  ): Promise<Survey>;
  deleteOneBySlug(slug: string): Promise<void>;
  updateOneBySlug(slug: string, data: any): Promise<Survey | null>;
  getSlugBySlug(slug: string): Promise<Pick<Survey, "slug"> | null>;
  getActivatedAtBySlug(
    slug: string,
  ): Promise<Pick<Survey, "activatedAt"> | null>;
}

export interface IAnswerRepository {
  getAllFromSurvey(slug: string): Promise<Answer[]>;
  getById(
    id: string,
  ): Promise<
    (Answer & { surveys: Pick<Survey, "name" | "questions"> | null }) | null
  >;
  createOne(
    answer: CreateAnswerData & { id: string; surveyId: string },
  ): Promise<Answer>;
  deleteById(id: string): Promise<void>;
  getIpByOriginIp(ip: string): Promise<Pick<Answer, "originIp"> | null>;
}

export interface IUserRepository {
  createOne(
    data: Omit<CreateUserData, "passwordConfirm"> & { id: string },
  ): Promise<UserWithoutPassword>;
  getByEmail(email: string): Promise<User | null>;
  getByUsernameOnly(username: string): Promise<Pick<User, "username"> | null>;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// SERVICES

export interface ISurveyService extends Omit<
  ISurveyRepository,
  "getSlugBySlug" | "getActivatedAtBySlug"
> {}
export interface IAnswerService extends Omit<
  IAnswerRepository,
  "createOne" | "getIpByOriginIp"
> {
  createOne(answer: CreateAnswerData, slug: string): Promise<Answer>;
  validateAnswerCreation(
    survey: Survey,
    answer: CreateAnswerData,
  ): CreateAnswerData;
}

export interface IAuthService {
  signup(data: CreateUserData): Promise<UserWithToken>;
  login(data: LoginData): Promise<UserWithToken>;
  comparePassword(
    candidatePassword: string,
    correctPassword: string,
  ): Promise<boolean>;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

export type CreateSurveyData = z.infer<typeof createSurveySchema>;
export type Survey = CreateSurveyData & {
  id: string;
  isActive: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  activatedAt: Date | null;
};
export type Question = z.infer<typeof questionSchema>;

export type CreateAnswerData = z.infer<typeof createAnswerSchema>;
export type Answer = CreateAnswerData & {
  id: string;
  surveyId: string | null;
  createdAt: Date;
  deletedAt: Date | null;
};
export type Response = z.infer<typeof responseSchema>;

export type CreateUserData = z.infer<typeof createUserSchema>;
export type User = Omit<CreateUserData, "passwordConfirm"> & {
  id: string;
  createdAt: Date;
  deletedAt: Date | null;
};
export type UserWithoutPassword = Omit<User, "password">;
export type UserWithToken = {
  user: UserWithoutPassword;
  token: string;
};

export type QueryString = z.infer<typeof queryStringSchema>;

export interface ProtectedRequest extends Request {
  user?: Pick<User, "id" | "username" | "email">;
}

export type LoginData = z.infer<typeof loginDataSchema>;
