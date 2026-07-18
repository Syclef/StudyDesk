import type { ExamAttempt } from "../pages/Exam/examTypes";

const DRAFT_KEY = "asd_exam_attempt_draft";
const LAST_ATTEMPT_ID_KEY = "asd_last_exam_attempt_id";

export function saveAttemptDraft(attempt: ExamAttempt) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(attempt));
}

export function loadAttemptDraft(): ExamAttempt | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLastAttemptId(id: string) {
  localStorage.setItem(LAST_ATTEMPT_ID_KEY, id);
}

export function loadLastAttemptId(): string | null {
  return localStorage.getItem(LAST_ATTEMPT_ID_KEY);
}