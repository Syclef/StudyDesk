import type { Question } from "../api/questions";

export interface ExamAttempt {
  id: string;
  date: string;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  scorePercent: number;
  answers: Record<number, string>;
}

/**
 * Save an exam attempt to localStorage
 */
export function saveExamAttempt(
  questions: Question[],
  answers: Record<number, string>
) {
  const correct = questions.filter(
    (q) => answers[q.id] === q.correct_answer
  ).length;

  const unanswered = questions.filter(
    (q) => !answers[q.id]
  ).length;

  const incorrect =
    questions.length - correct - unanswered;

  const attempt: ExamAttempt = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    total: questions.length,
    correct,
    incorrect,
    unanswered,
    scorePercent: Math.round(
      (correct / questions.length) * 100
    ),
    answers,
  };

  const existing =
    JSON.parse(
      localStorage.getItem("examAttempts") || "[]"
    ) as ExamAttempt[];

  existing.unshift(attempt);

  localStorage.setItem(
    "examAttempts",
    JSON.stringify(existing)
  );
}

/**
 * Load all saved exam attempts
 */
export function loadExamAttempts(): ExamAttempt[] {
  return JSON.parse(
    localStorage.getItem("examAttempts") || "[]"
  );
}
