import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/exam-engine.css";

import type { ExamResult } from "./examTypes";

function prettyDuration(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm}m ${ss}s`;
}

export default function ExamResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);

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

  const scoreLabel = useMemo(() => {
    if (!result) return "";
    if (result.scorePercent >= 80) return "PASS";
    if (result.scorePercent >= 70) return "BORDERLINE";
    return "FAIL";
  }, [result]);

  if (!result) return null;

  return (
    <div className="exam-results-page">
      <div className="exam-results-card">
        <div className="results-header">
          <h1 className="exam-title">Results</h1>
          <div className={`score-pill ${scoreLabel.toLowerCase()}`}>{scoreLabel}</div>
        </div>

        <div className="results-score">
          <div className="big">{result.scorePercent}%</div>
          <div className="meta">
            {result.correct} correct • {result.incorrect} incorrect • {result.unanswered} unanswered
          </div>
          <div className="meta2">
            {result.total} questions • {prettyDuration(result.durationSeconds)} • submitted{" "}
            {new Date(result.submittedAtISO).toLocaleString()}
          </div>
        </div>

        <div className="results-actions">
          <button className="exam-primary-btn" onClick={() => navigate("/exam/review")}>
            Review answers
          </button>
          <button className="exam-secondary-btn" onClick={() => navigate("/exam")}>
            Back to setup
          </button>
        </div>
      </div>
    </div>
  );
}
