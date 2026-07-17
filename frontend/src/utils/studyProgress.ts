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
  all[category] = {
    attempted: total,
    correct: correct,
    total,
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearCategoryProgress(category: string) {
  const all = getStudyProgress();
  delete all[category];
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearAllStudyProgress() {
  localStorage.removeItem(KEY);
}
