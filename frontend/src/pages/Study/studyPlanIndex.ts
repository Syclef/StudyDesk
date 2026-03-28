// Keep your imports
import { QUESTIONS } from "../../data/questions";
import { PracticeQuestion } from "../../data/practice/types";

export interface StudyTask {
  taskId: string;
  domain: string;
  category: string;
  total: number;
}

// Keep your clever logic here
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

// ADD THIS at the bottom: This helps the UI show colors/titles
export const DOMAIN_METADATA: Record<string, { title: string; color: string }> = {
  "Domain 1": { title: "IS Auditing Process", color: "#3B82F6" },
  "Domain 2": { title: "Governance & IT Management", color: "#10B981" },
  "Domain 3": { title: "Acquisition & Implementation", color: "#F59E0B" },
  "Domain 4": { title: "Operations & Resilience", color: "#8B5CF6" },
  "Domain 5": { title: "Information Asset Protection", color: "#EF4444" },
};