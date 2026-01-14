import { useNavigate } from "react-router-dom";

export default function ExamLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="page-card">
        <h1 className="page-title">Exam</h1>

        <p className="page-desc">
          Exam Mode simulates the real CISA exam experience. Take timed mock exams,
          flag questions for review, and review performance breakdown after submission.
        </p>

        <ul className="page-bullets">
          <li>Timed exam simulation</li>
          <li>Flag for review + question navigator</li>
          <li>Results summary and review mode</li>
        </ul>

        <div className="page-actions">
          <button className="primary-btn" onClick={() => navigate("/exam/setup")}>
            Start Exam Simulator
          </button>
          <button className="secondary-btn" onClick={() => navigate("/exam/history")}>
            View History
          </button>
        </div>

        <div className="exam-landing-mocks">
          <h2 className="page-subtitle">Mock Exams</h2>
          <div className="mock-grid">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className="mock-card"
                onClick={() => navigate("/exam/setup", { state: { mock: n } })}
              >
                Mock Exam {n}
                <span className="mock-sub">150 questions • 4 hours</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
