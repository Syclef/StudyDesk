export interface StudyTask {
  id: string;
  type: "domain" | "practice-exam";
  title: string;
  domain?: string;
  questionCount: number;
  durationMinutes: number;
}

export const STUDY_TASKS: StudyTask[] = [
  {
    id: "PE-1",
    type: "practice-exam",
    title: "Practice Exam 1",
    questionCount: 150,
    durationMinutes: 240,
  },
  {
    id: "D1",
    type: "domain",
    title: "Information Systems Auditing Process",
    domain: "Information Systems Auditing Process",
    questionCount: 300,
    durationMinutes: 600,
  },
];
