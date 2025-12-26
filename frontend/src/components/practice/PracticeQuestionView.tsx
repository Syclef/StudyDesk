import React, { useEffect, useState } from "react";
import { JustificationPanel } from "./JustificationPanel";
import { SessionSummary } from "./SessionSummary";

interface QuestionDTO {
  id: string;
  index: number;
  total: number;
  stem: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface AnswerResultDTO {
  correctChoice: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  justification: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export const PracticeQuestionView: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const [question, setQuestion] = useState<QuestionDTO | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResultDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  /* =====================================
     INITIAL QUESTION LOAD
     ===================================== */
  useEffect(() => {
    fetch(`/practice/session/${sessionId}/next`)
      .then(res => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((q: QuestionDTO) => {
        setQuestion(q);
        setSelected(null);
        setResult(null);
        setLoading(false);
      })
      .catch(() => {
        // TEMP MOCK QUESTION
        setQuestion({
          id: "q1",
          index: 1,
          total: 3,
          stem:
            "Which of the following is the PRIMARY responsibility of an IS auditor?",
          choices: {
            A: "Designing business controls",
            B: "Implementing IT policies",
            C: "Evaluating the adequacy of controls",
            D: "Managing IT operations",
          },
        });
        setLoading(false);
      });
  }, [sessionId]);

  /* =====================================
     SUBMIT ANSWER
     ===================================== */
  const submitAnswer = () => {
    if (!question || !selected) return;

    fetch(`/practice/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: question.id,
        selectedChoice: selected,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((r: AnswerResultDTO) => {
        setResult(r);
        if (r.isCorrect) {
          setCorrectCount(prev => prev + 1);
        }
      })
      .catch(() => {
        const isCorrect = selected === "C";
        setResult({
          correctChoice: "C",
          isCorrect,
          justification: {
            a: "Designing controls is a management responsibility.",
            b: "Implementing policies is an operational function.",
            c: "The IS auditor evaluates the adequacy and effectiveness of controls.",
            d: "Managing IT operations compromises auditor independence.",
          },
        });
        if (isCorrect) {
          setCorrectCount(prev => prev + 1);
        }
      });
  };

  /* =====================================
     LOAD NEXT QUESTION OR FINISH
     ===================================== */
  const loadNextQuestion = () => {
    if (!question) return;

    // ✅ LAST QUESTION → SHOW SUMMARY
    if (question.index === question.total) {
      setShowSummary(true);
      return;
    }

    setLoading(true);

    fetch(`/practice/session/${sessionId}/next`)
      .then(res => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((q: QuestionDTO) => {
        setQuestion(q);
        setSelected(null);
        setResult(null);
        setLoading(false);
      })
      .catch(() => {
        // TEMP MOCK NEXT QUESTION
        setQuestion(prev =>
          prev
            ? {
                ...prev,
                id: `q${prev.index + 1}`,
                index: prev.index + 1,
                stem:
                  "Which of the following BEST ensures auditor independence?",
                choices: {
                  A: "Rotating audit staff",
                  B: "Implementing controls",
                  C: "Reporting to IT management",
                  D: "Performing system administration",
                },
              }
            : prev
        );
        setSelected(null);
        setResult(null);
        setLoading(false);
      });
  };

  /* =====================================
     SESSION SUMMARY
     ===================================== */
  if (showSummary && question) {
    return (
      <SessionSummary
        total={question.total}
        correct={correctCount}
      />
    );
  }

  if (loading || !question) {
    return <p>Loading question…</p>;
  }

  return (
    <section className="practice-question">
      <div className="question-header">
        Question {question.index} of {question.total}
      </div>

      <div className="question-stem">{question.stem}</div>

      <div className="choices">
        {(["A", "B", "C", "D"] as const).map(letter => {
          const isSelected = selected === letter;
          const isCorrect = result && result.correctChoice === letter;
          const isWrong =
            result && selected === letter && !result.isCorrect;

          return (
            <label
              key={letter}
              className={`choice ${
                isSelected ? "selected" : ""
              } ${isCorrect ? "correct" : ""} ${
                isWrong ? "incorrect" : ""
              }`}
            >
              <input
                type="radio"
                name="choice"
                value={letter}
                disabled={!!result}
                checked={isSelected}
                onChange={() => setSelected(letter)}
              />
              <strong>{letter}.</strong> {question.choices[letter]}
            </label>
          );
        })}
      </div>

      {!result && (
        <button
          className="submit-answer-btn"
          disabled={!selected}
          onClick={submitAnswer}
        >
          Submit Answer
        </button>
      )}

      {result && (
        <>
          <JustificationPanel justification={result.justification} />
          <button
            className="next-question-btn"
            onClick={loadNextQuestion}
          >
            {question.index === question.total
              ? "Finish Session"
              : "Next Question"}
          </button>
        </>
      )}
    </section>
  );
};
