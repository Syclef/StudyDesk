import { ExamAttempt } from "./examTypes";

const DRAFT_KEY = "asd_exam_attempt_draft";

export function saveAttemptDraft(attempt: ExamAttempt) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(attempt));
}

export function loadAttemptDraft(): ExamAttempt | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAttemptDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
