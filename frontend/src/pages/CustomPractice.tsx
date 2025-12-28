import React, { useState } from "react";
import { PracticeMetrics } from "../components/practice/PracticeMetrics";

export default function CustomPractice() {
  const [questionCount, setQuestionCount] = useState(30);

  return (
    <section className="custom-practice">
      <h1>Custom Practice</h1>

      <PracticeMetrics
        percentCorrect={0}
        questionsTaken={0}
        avgAnswerTime="00:00"
        avgCorrectTime="00:00"
        avgIncorrectTime="00:00"
        avgSessionDuration="00:00"
      />

      <div className="practice-banner">
        <strong>No practice data yet</strong>
        <p>
          Start a custom practice session to generate performance metrics.
        </p>
      </div>

      <div className="practice-config">
        <h3>Configure Practice</h3>

        <label>
          Number of Questions
          <select
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(Number(e.target.value))
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <h3>Previous Custom Practice Sessions</h3>
      <table className="practice-table">
        <thead>
          <tr>
            <th>Attempt Date</th>
            <th>Questions Taken</th>
            <th>% Correct</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>No previous sessions</td>
          </tr>
        </tbody>
      </table>

      <button
        className="practice-action-btn"
        onClick={() => {
          window.location.href =
            `/practice/session/custom-${Date.now()}`;
        }}
      >
        Start Custom Practice
      </button>
    </section>
  );
}
