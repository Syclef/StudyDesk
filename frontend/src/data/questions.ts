import { PracticeQuestion } from "./practice/types";
import { domain1Questions } from "./practice/domain0";

export const QUESTIONS: PracticeQuestion[] = domain1Questions;


/**
 * Helper maps (used by Practice Dashboard & Category pages)
 */
export const QUESTIONS_BY_CATEGORY = QUESTIONS.reduce<Record<string, PracticeQuestion[]>>(
  (acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  },
  {}
);

export const QUESTIONS_BY_DOMAIN = QUESTIONS.reduce<Record<string, PracticeQuestion[]>>(
  (acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = [];
    acc[q.domain].push(q);
    return acc;
  },
  {}
);
