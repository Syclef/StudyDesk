import React from "react";

export const ExamDashboard: React.FC = () => {
  return (
    <section className="exam-dashboard">
      <h1>Exam Mode</h1>

      <p>
        This exam simulates the actual certification environment.
        You will not receive feedback until the exam is complete.
      </p>

      <ul>
        <li>Timed exam</li>
        <li>One attempt only</li>
        <li>No answer review during the exam</li>
        <li>Domain-weighted scoring</li>
      </ul>

      <button
        className="practice-action-btn"
        onClick={() => {
          // TEMP MOCK — real exam session later
          window.location.href = "/exam/session/mock-exam-1";
        }}
      >
        Start Exam
      </button>
    </section>
  );
};
