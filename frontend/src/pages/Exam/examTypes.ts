export type ExamMode = "full" | "domain" | "custom";

export interface ExamChoice {
  id: string;
  label: string; // A / B / C / D
  text: string;
}

export interface ExamQuestion {
  id: string;
  domain: number;
  ks?: string;
  text: string;
  explanation?: string;
  correctChoiceId: string;
  choices: ExamChoice[];
}

export interface ExamUserAnswer {
  questionId: string;
  choiceId: string;
}

export interface ExamSession {
  id: string;
  createdAt: string;
  mode: ExamMode;
  domains: number[];
  durationMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamAttempt {
  id: string;
  createdAt: string;
  finishedAt?: string;
  mode: ExamMode;
  domains: number[];
  durationMinutes: number;
  questions: ExamQuestion[];

  answers: Record<string, ExamUserAnswer>;
  flagged: Record<string, boolean>;

  autoSubmitted?: boolean;
}
