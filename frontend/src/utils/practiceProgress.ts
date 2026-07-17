export interface CategoryProgress {
  attempted: number;
  correct: number;
  lastScorePct: number;
  lastAttemptedAt: string;
}

const STORAGE_KEY = "studydesk_practice_progress_v1";

function loadAll(): Record<string, CategoryProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, CategoryProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAllProgress(): Record<string, CategoryProgress> {
  return loadAll();
}

export function getCategoryProgress(category: string): CategoryProgress | null {
  return loadAll()[category] ?? null;
}

export function recordSessionResult(
  category: string,
  correctCount: number,
  totalCount: number
) {
  const all = loadAll();
  const prev = all[category];

  all[category] = {
    attempted: (prev?.attempted ?? 0) + totalCount,
    correct: (prev?.correct ?? 0) + correctCount,
    lastScorePct:
      totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0,
    lastAttemptedAt: new Date().toISOString(),
  };

  saveAll(all);
}

export function clearAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
