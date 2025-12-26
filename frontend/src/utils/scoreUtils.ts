/* =====================================================
   SHARED SCORING & RANKING LOGIC (ISACA-STYLE)
   ===================================================== */

/* ---------- CARD PICKER ---------- */

// Conservative, defensible cap per session
export const CARD_PICKER_MAX_RAW_SCORE = 13000;

export function getCardPickerWeightedScore(rawScore: number): number {
  const weighted = (rawScore / CARD_PICKER_MAX_RAW_SCORE) * 1000;
  return Math.min(1000, Math.round(weighted));
}

/* ---------- CARD HUNTER ---------- */

// 6 rounds × (150 base + 50 time bonus)
export const CARD_HUNTER_MAX_RAW_SCORE = 1200;

export function getCardHunterWeightedScore(rawScore: number): number {
  const weighted = (rawScore / CARD_HUNTER_MAX_RAW_SCORE) * 1000;
  return Math.min(1000, Math.round(weighted));
}

/* ---------- STORAGE HELPERS ---------- */

export function saveHighScore(
  key: string,
  rawScore: number,
  weightedScore: number
) {
  const stored = JSON.parse(
    localStorage.getItem(key) || '{"raw":0,"weighted":0}'
  );

  if (rawScore > stored.raw) {
    localStorage.setItem(
      key,
      JSON.stringify({
        raw: rawScore,
        weighted: weightedScore
      })
    );
  }
}

export function loadHighScore(key: string): {
  raw: number;
  weighted: number;
} {
  return JSON.parse(
    localStorage.getItem(key) || '{"raw":0,"weighted":0}'
  );
}

export function resetAllScores() {
  localStorage.removeItem("auditstudydesk:card-picker");
  localStorage.removeItem("auditstudydesk:card-hunter");
}
