import { useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import type { Question } from "../api/questions";

/**
 * Review Mode (Polished)
 * - Perform-style structure
 * - Clear hierarchy
 * - Read-only
 */
export default function Review() {
  const location = useLocation();

  // Safety: redirect if refreshed
  if (!location.state) {
    return <Navigate to="/exam" replace />;
  }

  const {
    questions,
    answers,
  }: {
    questions: Question[];
    answers: Record<number, string>;
  } = location.state;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<
    "all" | "correct" | "incorrect" | "unanswered"
  >("all");

  /* ================= DERIVED DATA ================= */

  const reviewed = questions.map((q) => {
    const selected = answers[q.id];
    const correct = q.correct_answer;

    let status: "correct" | "incorrect" | "unanswered" = "unanswered";
    if (selected) {
      status = selected === correct ? "correct" : "incorrect";
    }

    return { question: q, selected, status };
  });

  const filtered = reviewed.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const correctCount = reviewed.filter((r) => r.status === "correct").length;
  const incorrectCount = reviewed.filter((r) => r.status === "incorrect").length;
  const unansweredCount = reviewed.filter((r) => r.status === "unanswered").length;

  const current = filtered[currentIndex];

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* ===== SUMMARY HEADER ===== */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Correct" value={correctCount} color="green" />
        <SummaryCard label="Incorrect" value={incorrectCount} color="red" />
        <SummaryCard label="Unanswered" value={unansweredCount} color="gray" />
        <SummaryCard
          label="Score"
          value={`${Math.round((correctCount / questions.length) * 100)}%`}
          color="blue"
        />
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex gap-2">
        {["all", "correct", "incorrect", "unanswered"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f as any);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded border text-sm ${
              filter === f ? "bg-slate-200" : "bg-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== MAIN REVIEW ===== */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No questions in this category.</p>
      ) : (
        <div className="flex gap-6">
          {/* LEFT: QUESTION NAV */}
          <div className="w-44 space-y-2">
            {filtered.map((r, i) => (
              <button
                key={r.question.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full py-1 rounded text-sm font-medium
                  ${
                    r.status === "correct"
                      ? "bg-green-200"
                      : r.status === "incorrect"
                      ? "bg-red-200"
                      : "bg-gray-200"
                  }`}
              >
                Question {i + 1}
              </button>
            ))}
          </div>

          {/* RIGHT: QUESTION DETAIL */}
          <div className="flex-1 bg-white rounded-lg shadow p-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Question {currentIndex + 1} of {filtered.length}
              </p>
              <p className="font-semibold text-lg">
                {current.question.question}
              </p>
            </div>

            {/* ANSWERS */}
            <div className="space-y-2">
              {Object.entries(current.question.choices).map(([key, value]) => {
                let style = "border bg-white";

                if (key === current.question.correct_answer) {
                  style = "border-green-500 bg-green-50";
                } else if (key === current.selected) {
                  style = "border-red-500 bg-red-50";
                }

                return (
                  <div
                    key={key}
                    className={`p-3 rounded border ${style}`}
                  >
                    <strong>{key}.</strong> {value}
                  </div>
                );
              })}
            </div>

            {/* JUSTIFICATION */}
            <div className="bg-slate-100 rounded p-4">
              <p className="font-semibold mb-1">Justification</p>
              <p className="text-sm text-gray-700">
                {current.question.explanation}
              </p>
            </div>

            {/* METADATA */}
            <div className="text-xs text-gray-500 flex gap-4">
              <span>Domain {current.question.domain}</span>
              <span>Difficulty: {current.question.difficulty}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== SMALL COMPONENT ===== */

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: "green" | "red" | "gray" | "blue";
}) {
  const colorMap = {
    green: "text-green-700",
    red: "text-red-700",
    gray: "text-gray-700",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}
