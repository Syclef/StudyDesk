import React from "react";

export const ExamSummary: React.FC = () => {
  return (
    <section className="exam-summary">
      <h2>Exam Complete</h2>
      <p>Your exam responses have been submitted.</p>
      <p>Results will be calculated based on domain-weighted scoring.</p>

      <button
        className="practice-action-btn"
        onClick={() => (window.location.href = "/exam")}
      >
        Back to Exam Home
      </button>
    </section>
  );
};
