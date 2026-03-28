/* =====================================================
   ISACA-STYLE SCORING UTILITIES
   ===================================================== */

export const TOTAL_FLASHCARDS = 216;
export const RANK_SCALE = 1000;

/* ---------- Card Hunter I ---------- */
/* Fixed-length sampling test (6 rounds) */

export function computeCardHunterScore(
  correctConcepts: number,
  maxConcepts = 6
): number {
  if (correctConcepts <= 0) return 0;

  const coverageRatio = correctConcepts / TOTAL_FLASHCARDS;
  const confidenceWeight = correctConcepts / maxConcepts;

  return Math.round(
    coverageRatio * confidenceWeight * RANK_SCALE
  );
}

/* ---------- Card Picker ---------- */
/* Open-ended coverage + accuracy test */

export function computeCardPickerScore(
  correctConcepts: number,
  attemptedConcepts: number
): number {
  if (correctConcepts <= 0 || attemptedConcepts <= 0) return 0;

  const coverageRatio = correctConcepts / TOTAL_FLASHCARDS;
  const accuracyWeight = correctConcepts / attemptedConcepts;
  const volumeWeight = Math.log10(attemptedConcepts + 1);

  return Math.round(
    coverageRatio *
      accuracyWeight *
      volumeWeight *
      RANK_SCALE
  );
}

/* ---------- Rank ---------- */

export function computeRank(weightedScore: number): number {
  if (weightedScore <= 0) return 0;
  return Math.max(1, RANK_SCALE - weightedScore);
}
