import type { Question } from "../api/questions";

interface Props {
  question: Question;
  selectedAnswer?: string;
  onSelect: (choice: string) => void;
}

export default function ExamQuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: Props) {
  const isAnswered = Boolean(selectedAnswer);

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      {/* Question header */}
      <div className="px-5 py-4 border-b bg-gray-50">
        <p className="font-semibold text-gray-800">
          {question.question}
        </p>
      </div>

      {/* Answer choices */}
      <div className="px-5 py-4 space-y-2">
        {Object.entries(question.choices).map(([key, value]) => {
          let base =
            "border rounded px-4 py-2 cursor-pointer";

          if (isAnswered) {
            if (key === selectedAnswer) {
              base += " bg-blue-100 border-blue-400";
            } else {
              base += " opacity-60";
            }
          } else {
            base += " hover:bg-gray-100";
          }

          return (
            <div
              key={key}
              className={base}
              onClick={() => {
                if (!isAnswered) onSelect(key);
              }}
            >
              <strong>{key}.</strong> {value}
            </div>
          );
        })}
      </div>

      {/* Metadata */}
      <div className="px-5 py-2 border-t text-xs text-gray-500 bg-gray-50">
        Domain {question.domain}
      </div>
    </div>
  );
}
