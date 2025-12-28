import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/practice-question.css";

import { QUESTIONS } from "../../data/questions";
import type { PracticeQuestion } from "../../data/practice/types";

export function PracticeQuestionView() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  if (!category) return null;

  const decodedCategory = decodeURIComponent(category).trim().toLowerCase();

  const questions: PracticeQuestion[] = QUESTIONS.filter(q =>
    q.category.trim().toLowerCase() === decodedCategory
  );

  const [index, setIndex] = useState(0);

  /* 🔍 HARD DEBUG — NEVER REMOVE */
  if (!questions.length) {
    return (
      <div className="practice-review-container">
        <h2>No questions found</h2>

        <p><strong>URL category:</strong> {decodedCategory}</p>
        <p><strong>Total questions loaded:</strong> {QUESTIONS.length}</p>

        <p><strong>Available categories:</strong></p>
        <ul>
          {[...new Set(QUESTIONS.map(q => q.category))].map(cat => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>

        <button onClick={() => navigate("/practice")}>Back</button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="practice-review-container">
      {/* HEADER */}
      <div className="practice-review-header">
        <h2>{q.category}</h2>
        <button className="done-btn" onClick={() => navigate("/practice")}>
          Done Reviewing
        </button>
      </div>

      {/* NAV */}
      <div className="practice-review-nav">
        <button
          disabled={index === 0}
          onClick={() => setIndex(i => i - 1)}
        >
          ◀
        </button>

        <span>
          {index + 1} of {questions.length}
        </span>

        <button
          disabled={index === questions.length - 1}
          onClick={() => setIndex(i => i + 1)}
        >
          ▶
        </button>
      </div>

      {/* QUESTION CARD */}
      <div className="practice-review-card">
        {/* QUESTION */}
        <div className="question-text">{q.question}</div>

        {/* CHOICES */}
        <div className="choices-grid">
          {(["A", "B", "C", "D"] as const).map(letter => (
            <div
              key={letter}
              className={`choice ${
                letter === q.correctAnswer ? "correct" : ""
              }`}
            >
              <strong>{letter}.</strong> {q.choices[letter]}
            </div>
          ))}
        </div>

        {/* JUSTIFICATION */}
        <div className="justification-box">
          <strong>{q.correctAnswer} is the correct answer.</strong>

          <h4>Justification</h4>

          <p><strong>A.</strong> {q.justification.A}</p>
          <p><strong>B.</strong> {q.justification.B}</p>
          <p><strong>C.</strong> {q.justification.C}</p>
          <p><strong>D.</strong> {q.justification.D}</p>

          {/* META */}
          <div className="meta-box">
            <div>
              <strong>Domain</strong>
              <br />
              {q.domain}
            </div>

            <div>
              <strong>Knowledge Statement</strong>
              <br />
              {q.category}
            </div>

            {q.taskStatement && (
              <div>
                <strong>Task Statement</strong>
                <br />
                {q.taskStatement}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
