import { QUESTIONS } from "../../data/questions";
import { PracticeQuestion } from "../../data/practice/types";

export interface StudyTask {
  taskId: string;
  domain: string;
  category: string;
  total: number;
}

export const STUDY_TASKS: StudyTask[] = Object.values(
  QUESTIONS.reduce<Record<string, StudyTask>>(
    (acc: Record<string, StudyTask>, q: PracticeQuestion) => {
      if (!acc[q.taskId]) {
        acc[q.taskId] = {
          taskId: q.taskId,
          domain: q.domain,
          category: q.category,
          total: 0,
        };
      }
      acc[q.taskId].total++;
      return acc;
    },
    {}
  )
);
