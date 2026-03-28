import { useState } from "react";
import "./question-engine.css";

interface Question {
  id: string;
  question: string;
  choices: Record<string, string>;
  correctAnswer?: string;
  justification?: Record<string, string>;
}

interface Props {
  questions: Question[];
  mode: "study" | "practice" | "test";
  onComplete: () => void;
}

export default function QuestionEngine({
  questions,
  mode,
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);

  const q = questions[index];

  if (!q) {
    return (
      <div className="qe-finish">
        <h2>Session Complete</h2>
        <button onClick={onComplete}>Return</button>
      </div>
    );
  }

  return (
    <div className="qe-container">
      <div className="qe-header">
        {index + 1} of {questions.length}
      </div>

      <p className="qe-question">
        {q.question}
      </p>

      <div className="qe-choices">
        {Object.entries(q.choices).map(
          ([key, text]) => (
            <button
              key={key}
              className="qe-choice"
              onClick={() =>
                setIndex(index + 1)
              }
            >
              <strong>{key}.</strong> {text}
            </button>
          )
        )}
      </div>
    </div>
  );
}
