export interface ISurveyRepository {
  getAll: (search?: string, active?: boolean, date?: string) => Promise<any[]>;
  getBySlug: (slug: string) => Promise<any>;
  createOne: (survey: any) => Promise<any>;
}
export interface ISurveyService extends ISurveyRepository {}

export interface IAnswerRepository {
  getAllFromSurvey: (slug: string) => Promise<any[]>;
  getById: (id: number) => Promise<any>;
  createOne: (answer: any) => Promise<any>;
}

export interface IAnswerService extends Omit<IAnswerRepository, "createOne"> {
  createOne: (answer: any, slug: string) => Promise<any>;
}

export interface Survey {
  id: number;
  name: string;
  questions: Question[];
  createdAt: string;
  deletedAt?: string;
  slug: string;
}

export interface Answer {
  id: number;
  surveyId: number;
  responses: Response[];
}

export interface Profile {
  id: number;
  email: string;
  password: string;
  username: string;
}

export interface Question {
  id: number;
  name: string;
  type: QuestionType;
  options?: string[];
  isRequired?: boolean;
}

export enum QuestionType {
  multiSelect = "MULTI_SELECT",
  singleSelect = "SINGLE_SELECT",
  textAnser = "TEXT_ANSWER",
}

export interface Response {
  id: number;
  content: string;
}
