import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface QuestionDTO {
  id: string;
  index: number;
  total: number;
  stem: string;
  domain: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export const ExamQuestionView: React.FC = () => {
  const { examSessionId } = useParams<{ examSessionId: string }>();

  const [question, setQuestion] = useState<QuestionDTO | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer (seconds)
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours mock

  /* ===============================
     TIMER (EXAM RULE)
     =============================== */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/exam/summary";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ===============================
     LOAD QUESTION
     =============================== */
  useEffect(() => {
    if (!examSessionId) return;

    fetch(`/exam/session/${examSessionId}/next`)
      .then(res => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((q: QuestionDTO) => {
        setQuestion(q);
        setSelected(null);
        setLoading(false);
      })
      .catch(() => {
        // TEMP MOCK QUESTION
        setQuestion({
          id: "eq1",
          index: 1,
          total: 150,
          domain: "Governance and Management of IT",
          stem:
            "Which of the following is the MOST important role of the board of directors regarding IT governance?",
          choices: {
            A: "Implement IT controls",
            B: "Define IT strategy alignment",
            C: "Operate IT services",
            D: "Develop applications",
          },
        });
        setLoading(false);
      });
  }, [examSessionId]);

  const submitAnswer = () => {
    if (!question || !selected) return;

    fetch("/exam/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examSessionId,
        questionId: question.id,
        selectedChoice: selected,
      }),
    })
      .then(() => {
        // Immediately load next question (NO FEEDBACK)
        loadNextQuestion();
      })
      .catch(() => {
        // TEMP MOCK PROGRESSION
        loadNextQuestion();
      });
  };

  const loadNextQuestion = () => {
    if (!question) return;

    if (question.index === question.total) {
      window.location.href = "/exam/summary";
      return;
    }

    setLoading(true);

    fetch(`/exam/session/${examSessionId}/next`)
      .then(res => res.json())
      .then((q: QuestionDTO) => {
        setQuestion(q);
        setSelected(null);
        setLoading(false);
      })
      .catch(() => {
        setQuestion(prev =>
          prev
            ? {
                ...prev,
                id: `eq${prev.index + 1}`,
                index: prev.index + 1,
                stem:
                  "Which of the following BEST ensures effective IT governance?",
              }
            : prev
        );
        setSelected(null);
        setLoading(false);
      });
  };

  if (loading || !question) {
    return <p>Loading exam question…</p>;
  }

  return (
    <section className="exam-question">
      <div className="exam-header">
        <span>
          Question {question.index} of {question.total}
        </span>
        <span className="exam-timer">
          Time Remaining: {Math.floor(timeLeft / 3600)}:
          {Math.floor((timeLeft % 3600) / 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>

      <div className="question-stem">{question.stem}</div>

      <div className="choices">
        {(["A", "B", "C", "D"] as const).map(letter => (
          <label key={letter} className="choice">
            <input
              type="radio"
              name="choice"
              value={letter}
              checked={selected === letter}
              onChange={() => setSelected(letter)}
            />
            <strong>{letter}.</strong> {question.choices[letter]}
          </label>
        ))}
      </div>

      <button
        className="submit-answer-btn"
        disabled={!selected}
        onClick={submitAnswer}
      >
        Submit Answer
      </button>
    </section>
  );
};
