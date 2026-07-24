// Official CISA domain weights, used for building the 5 Exam Sets
// (examUtils.ts) and the 5 full 150-question Practice Sets
// (PracticeSessionPage.tsx) — both mirror the real exam's domain
// distribution, so they must always weight questions identically.
//
// This used to be a copy-pasted constant in both files, which is exactly
// how it drifted out of sync: one file got updated to the corrected
// weights (18/18/12/26/26) while the other was silently left on an
// earlier, superseded set (21/17/12/23/27). Import this from here in any
// file that needs domain-weighted selection, rather than re-declaring it
// locally, so a future correction only has to happen once.
export const CISA_DOMAIN_WEIGHTS: Record<string, number> = {
  D1: 0.18,
  D2: 0.18,
  D3: 0.12,
  D4: 0.26,
  D5: 0.26,
};
