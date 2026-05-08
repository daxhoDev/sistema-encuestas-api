export interface Survey {
  id: number;
  name: string;
  questions: Question[];
  createdAt: string;
  deletedAt?: string;
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

enum QuestionType {
  multiSelect = "MULTI_SELECT",
  singleSelect = "SINGLE_SELECT",
  textAnser = "TEXT_ANSWER",
}

export interface Response {
  id: number;
  response: string;
}
