// Shared logic for both ExamLandingPage.tsx and Dashboard.tsx — a single
// source of truth for "what counts as a completed exam cycle."
//
// A cycle = one attempt on each of the 5 distinct Exam Sets. Retaking a set
// before the cycle is complete replaces that set's score for the cycle
// (most-recent-attempt-per-slot wins), consistent with how the rest of the
// app treats repeat answers elsewhere. Once all 5 slots have been attempted,
// that's a completed cycle; the next attempt starts a fresh one.

export interface CycleAttempt {
  id: string;
  mockSlot: number | null;
  percent: number | null;
  submittedAt: string | null;
}

export interface ExamCycle {
  attemptsBySlot: Record<number, CycleAttempt>;
  passedCount: number;
  completedAt: string;
}

export const PASS_THRESHOLD = 75;

export function computeExamCycles<T extends CycleAttempt>(attempts: T[]): {
  completedCycles: ExamCycle[];
  currentCycleUsed: Map<number, T>;
} {
  const valid = attempts
    .filter((a): a is T & { mockSlot: number; submittedAt: string } =>
      a.mockSlot !== null && a.mockSlot >= 1 && a.mockSlot <= 5 && a.submittedAt !== null
    )
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  const completedCycles: ExamCycle[] = [];
  let currentCycleUsed = new Map<number, T>();

  for (const a of valid) {
    currentCycleUsed.set(a.mockSlot, a);
    if (currentCycleUsed.size === 5) {
      const passedCount = Array.from(currentCycleUsed.values()).filter(x => (x.percent ?? 0) >= PASS_THRESHOLD).length;
      completedCycles.push({
        attemptsBySlot: Object.fromEntries(currentCycleUsed) as Record<number, CycleAttempt>,
        passedCount,
        completedAt: a.submittedAt,
      });
      currentCycleUsed = new Map();
    }
  }

  return { completedCycles, currentCycleUsed };
}
