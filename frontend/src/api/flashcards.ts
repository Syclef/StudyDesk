/**
 * Flashcards API layer
 * --------------------
 * Responsible ONLY for fetching flashcard data.
 * No UI or state logic here.
 */

export interface Flashcard {
  id: number;
  term: string;
  definition: string;
}

const API_BASE = "http://127.0.0.1:8000";

export async function fetchFlashcards(): Promise<Flashcard[]> {
  const res = await fetch(`${API_BASE}/flashcards`);

  if (!res.ok) {
    throw new Error("Failed to load flashcards");
  }

  return res.json();
}
