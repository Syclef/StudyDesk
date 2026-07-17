const KEY = "studydesk_study_progress";

export interface StudyCategoryProgress {
  attempted: number;
  correct: number;
  total: number;
}

export function getStudyProgress(): Record<string, StudyCategoryProgress> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function recordStudyResult(category: string, correct: number, total: number) {
  const all = getStudyProgress();
  const prev = all[category] ?? { attempted: 0, correct: 0, total };
  all[category] = {
    attempted: prev.attempted + total,
    correct: prev.correct + correct,
    total,
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearStudyProgress() {
  localStorage.removeItem(KEY);
}
