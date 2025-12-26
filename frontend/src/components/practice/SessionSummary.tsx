import React from "react";

interface SessionSummaryProps {
  total: number;
  correct: number;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  total,
  correct,
}) => {
  return (
    <section className="session-summary">
      <h2>Practice Session Complete</h2>

      <p>
        You answered <strong>{correct}</strong> out of{" "}
        <strong>{total}</strong> questions correctly.
      </p>

      <button
        className="practice-action-btn"
        onClick={() => (window.location.href = "/practice")}
      >
        Back to Practice
      </button>
    </section>
  );
};
