import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/questions";
import type { Question } from "../api/questions";
import PracticeQuestionCard from "../components/PracticeQuestionCard";

/**
 * Practice page
 * - Fetches questions from backend
 * - Handles domain filtering
 * - Tracks selected answers
 * - Passes state to question cards
 */
export default function Practice() {
  /* ===================== STATE ===================== */

  // All questions loaded from backend
  const [questions, setQuestions] = useState<Question[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Selected answers:
   * key   = question.id
   * value = selected choice (A, B, C, D)
   */
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  /**
   * Domain filter:
   * null = all domains
   * 1–5  = specific domain
   */
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);

  /* ===================== EFFECTS ===================== */

  // Load questions on first render
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch {
        setError("Unable to load questions");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ===================== HANDLERS ===================== */

  // Handle answer selection (lock after first click)
  function handleAnswerSelect(questionId: number, choice: string) {
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  }

  /* ===================== DERIVED DATA ===================== */

  // Apply domain filter
  const filteredQuestions =
    selectedDomain === null
      ? questions
      : questions.filter((q) => q.domain === selectedDomain);

  /* ===================== UI STATES ===================== */

  if (loading) return <div>Loading questions…</div>;
  if (error) return <div>{error}</div>;

  /* ===================== RENDER ===================== */

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Practice Questions</h1>

      {/* ================= DOMAIN FILTER ================= */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className={`px-3 py-1 rounded border ${
            selectedDomain === null ? "bg-gray-200" : ""
          }`}
          onClick={() => setSelectedDomain(null)}
        >
          All Domains
        </button>

        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            className={`px-3 py-1 rounded border ${
              selectedDomain === d ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedDomain(d)}
          >
            Domain {d}
          </button>
        ))}
      </div>

      {/* ================= QUESTIONS LIST ================= */}
      {filteredQuestions.length === 0 ? (
        <p className="text-gray-500">
          No questions available for this domain.
        </p>
      ) : (
        filteredQuestions.map((q) => (
          <PracticeQuestionCard
            key={q.id}
            question={q}
            selectedAnswer={selectedAnswers[q.id]}
            onSelect={(choice) =>
              handleAnswerSelect(q.id, choice)
            }
          />
        ))
      )}
    </div>
  );
}
