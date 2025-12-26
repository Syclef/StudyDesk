import type { Question } from "../api/questions";

/**
 * Perform-style Practice Question Card
 * - Layout and behavior inspired by ISACA Perform
 * - Content is entirely user-provided
 * - Colors intentionally different
 */
interface Props {
  question: Question;
  selectedAnswer?: string;
  onSelect: (choice: string) => void;
}

export default function PracticeQuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: Props) {
  const isAnswered = Boolean(selectedAnswer);
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      {/* ================= QUESTION HEADER ================= */}
      <div className="px-5 py-4 border-b bg-gray-50">
        <p className="text-base font-semibold text-gray-800">
          {question.question}
        </p>
      </div>

      {/* ================= ANSWER OPTIONS ================= */}
      <div className="px-5 py-4 space-y-2">
        {Object.entries(question.choices).map(([key, value]) => {
          let base =
            "border rounded px-4 py-2 cursor-pointer transition";

          if (!isAnswered) {
            base += " hover:bg-gray-100";
          }

          if (isAnswered) {
            if (key === question.correct_answer) {
              base +=
                " bg-emerald-100 border-emerald-400";
            } else if (key === selectedAnswer) {
              base +=
                " bg-rose-100 border-rose-400";
            } else {
              base += " opacity-60";
            }
          }

          return (
            <div
              key={key}
              className={base}
              onClick={() => {
                if (!isAnswered) onSelect(key);
              }}
            >
              <span className="font-semibold mr-2">
                {key}.
              </span>
              {value}
            </div>
          );
        })}
      </div>

      {/* ================= FEEDBACK / JUSTIFICATION ================= */}
      {isAnswered && (
        <div
          className={`px-5 py-4 border-t ${
            isCorrect
              ? "bg-emerald-50"
              : "bg-rose-50"
          }`}
        >
          <p
            className={`font-semibold ${
              isCorrect
                ? "text-emerald-700"
                : "text-rose-700"
            }`}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </p>

          <p className="mt-2 text-sm text-gray-700">
            <strong>Justification:</strong>{" "}
            {question.explanation}
          </p>
        </div>
      )}

      {/* ================= METADATA FOOTER ================= */}
      <div className="px-5 py-2 border-t text-xs text-gray-500 flex gap-4 bg-gray-50">
        <span>Domain {question.domain}</span>
        <span>Difficulty: {question.difficulty}</span>
      </div>
    </div>
  );
}
