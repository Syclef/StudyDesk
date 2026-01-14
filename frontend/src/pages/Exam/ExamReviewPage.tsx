import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/exam-engine.css";

import type { ExamResult, ExamQuestion } from "./examTypes";

export default function ExamReviewPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Force light theme for exam module (for now)
    document.documentElement.dataset.theme = "light";

    const raw = localStorage.getItem("examLastResult_v1");
    if (!raw) {
      navigate("/exam");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      navigate("/exam");
    }
  }, [navigate]);

  const q: ExamQuestion | null = useMemo(() => {
    if (!result) return null;
    return result.questions[index] ?? null;
  }, [result, index]);

  if (!result || !q) return null;

  const userAns = result.answers[q.index];
  const correct = q.correctAnswer;
  const isCorrect = userAns === correct;

  return (
    <div className="exam-review-page">
      <div className="exam-shell">
        <div className="exam-topbar">
          <div className="exam-topbar-left">
            <div className="exam-progress">
              Review <strong>{index + 1}</strong> / {result.questions.length}
            </div>
            <div className="exam-mini-stats">
              <span>Score: <strong>{result.scorePercent}%</strong></span>
              <span>Correct: <strong>{result.correct}</strong></span>
            </div>
          </div>

          <div className="exam-topbar-right">
            <button className="exam-secondary-btn" onClick={() => navigate("/exam/results")}>
              Back
            </button>
          </div>
        </div>

        <div className="exam-body">
          <div className="exam-question-card">
            <div className="exam-question-meta">
              <span className="chip">Domain {q.domain}</span>
              {q.topic ? <span className="meta">{q.topic}</span> : null}
              {result.flagged[q.index] ? <span className="chip warn">Flagged</span> : null}
            </div>

            <div className="exam-question-text">{q.question}</div>

            <div className="exam-choices">
              {Object.entries(q.choices).map(([letter, text]) => {
                const selected = userAns === letter;
                const isCorrectChoice = correct === letter;

                const cls = [
                  "exam-choice",
                  selected ? "selected" : "",
                  isCorrectChoice ? "correct" : "",
                  selected && !isCorrectChoice ? "wrong" : "",
                ].join(" ");

                return (
                  <div key={letter} className={cls}>
                    <span className="letter">{letter}</span>
                    <span className="text">{text}</span>
                  </div>
                );
              })}
            </div>

            <div className="exam-review-expl">
              <div className="line">
                <strong>Your answer:</strong> {userAns ?? "—"}
              </div>
              <div className="line">
                <strong>Correct:</strong> {correct} {isCorrect ? "✓" : "✗"}
              </div>
              {q.explanation ? (
                <div className="explanation">
                  <div className="exp-title">Explanation</div>
                  <div className="exp-body">{q.explanation}</div>
                </div>
              ) : null}
            </div>

            <div className="exam-nav-row">
              <button
                className="nav-btn"
                disabled={index === 0}
                onClick={() => setIndex(i => i - 1)}
              >
                Prev
              </button>

              <button
                className="nav-btn"
                disabled={index === result.questions.length - 1}
                onClick={() => setIndex(i => i + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="exam-grid-card">
            <div className="grid-title">Jump to</div>

            <div className="exam-grid">
              {result.questions.map((qq, idx) => {
                const answered = !!result.answers[qq.index];
                const flagged = !!result.flagged[qq.index];
                const isCur = idx === index;
                const correctHere = result.answers[qq.index] === qq.correctAnswer;

                return (
                  <button
                    key={qq.id + idx}
                    className={[
                      "grid-item",
                      isCur ? "current" : "",
                      answered ? "answered" : "",
                      flagged ? "flagged" : "",
                      answered && correctHere ? "right" : "",
                      answered && !correctHere ? "wrong" : "",
                    ].join(" ")}
                    onClick={() => setIndex(idx)}
                    type="button"
                    title={
                      flagged
                        ? "Flagged"
                        : answered
                          ? correctHere
                            ? "Answered (Correct)"
                            : "Answered (Wrong)"
                          : "Unanswered"
                    }
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="exam-exit">
              <button className="exam-primary-btn" onClick={() => navigate("/exam")}>
                New exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
