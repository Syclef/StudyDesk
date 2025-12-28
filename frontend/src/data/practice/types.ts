export type ChoiceLetter = "A" | "B" | "C" | "D";

export interface PracticeQuestion {
  id: string;

  /** Domain shown in ISACA Perform (e.g. "1 - Information System Auditing Process") */
  domain: string;

  /** Knowledge Statement (e.g. "1B3 - Audit Evidence Collection Techniques") */
  category: string;

  /** The question text (what ISACA shows at the top) */
  question: string;

  /** Answer choices */
  choices: Record<ChoiceLetter, string>;

  /** Correct answer (A–D) */
  correctAnswer: ChoiceLetter;

  /** Justification shown per choice in the green box */
  justification: Record<ChoiceLetter, string>;

  /** Task Statement (shown at the bottom of the justification box) */
  taskStatement?: string;
}
