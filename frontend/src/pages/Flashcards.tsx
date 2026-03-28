import { useEffect, useState } from "react";
import { fetchFlashcards, type Flashcard } from "../api/flashcards";
import FlashcardStudy from "../components/FlashcardStudy";
import FlashcardList from "../components/FlashcardList";

/**
 * Flashcards page
 * ---------------
 * Acts as the controller:
 * - Loads flashcards
 * - Switches between Study and List modes
 */
export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"study" | "list">("study");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFlashcards();
        setFlashcards(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div>Loading flashcards…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mode toggle (matches ISACA Perform behavior) */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("study")}
          className={`px-4 py-2 rounded ${
            mode === "study" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Study
        </button>
        <button
          onClick={() => setMode("list")}
          className={`px-4 py-2 rounded ${
            mode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          List
        </button>
      </div>

      {mode === "study" ? (
        <FlashcardStudy flashcards={flashcards} />
      ) : (
        <FlashcardList flashcards={flashcards} />
      )}
    </div>
  );
}
