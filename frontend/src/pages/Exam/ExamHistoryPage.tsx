import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamAttempt } from "./examTypes";
import { loadAttemptDraft, clearAttemptDraft } from "./examStorage";
import "../../styles/exam-engine.css";

export default function ExamHistoryPage() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    setAttempt(loadAttemptDraft());
  }, []);

  const goResults = () => {
    if (!attempt) return;
    navigate("/exam/results", { state: { attemptId: attempt.id } });
  };

  const clear = () => {
    clearAttemptDraft();
    setAttempt(null);
  };

  return (
    <div className="exam-history-page">
      <div className="exam-history-card">
        <h1 className="exam-history-title">Exam History</h1>

        {!attempt ? (
          <div className="exam-history-empty">
            No saved attempts yet.
          </div>
        ) : (
          <div className="exam-history-item">
            <div className="exam-history-row">
              <div>
                <strong>Attempt ID:</strong> {attempt.id}
              </div>
              <div>
                <strong>Mode:</strong> {attempt.mode}
              </div>
            </div>

            <div className="exam-history-row">
              <div>
                <strong>Domains:</strong> {attempt.domains.join(", ")}
              </div>
              <div>
                <strong>Questions:</strong> {attempt.questions.length}
              </div>
            </div>

            <div className="exam-history-actions">
              <button className="exam-history-btn" onClick={goResults}>
                View Results
              </button>
              <button className="exam-history-btn danger" onClick={clear}>
                Clear Saved Attempt
              </button>
            </div>
          </div>
        )}

        <div className="exam-history-actions">
          <button className="exam-history-btn" onClick={() => navigate("/exam")}>
            Back to Exam Setup
          </button>
        </div>
      </div>
    </div>
  );
}
