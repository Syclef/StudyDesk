import { useNavigate } from "react-router-dom";
import "../../styles/practice-dashboard.css";

export default function PracticeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="practice-dashboard">
      {/* HEADER */}
      <div className="practice-header">
        <h1>Dashboard</h1>
        <span className="reset-link">Reset all Questions</span>
      </div>

      {/* PROGRESS */}
      <div className="practice-progress">
        <div className="progress-label">100.0% Complete</div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-100" />
        </div>
      </div>

      {/* METRICS */}
      <div className="practice-metrics">
        <div className="metric-main">
          <div className="metric-main-value">68%</div>
          <div className="metric-main-label">Correct</div>
        </div>

        <div className="metric">
          <div className="metric-value">1072 of 1072</div>
          <div className="metric-label">Questions Taken</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:51</div>
          <div className="metric-label">Avg. Answer Time</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:48</div>
          <div className="metric-label">Avg. Correct Answer Time</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:58</div>
          <div className="metric-label">Avg. Incorrect Answer Time</div>
        </div>
      </div>

      {/* PRACTICE CARDS */}
      <div className="practice-cards">
        <div className="practice-card">
          <h3>Custom Practice</h3>
          <p>Configure a set of questions as you like.</p>
          <button
            className="select-btn"
            onClick={() => navigate("/practice/custom")}
          >
            Select
          </button>
        </div>

        <div className="practice-card">
          <h3>Category Practice</h3>
          <p>
            Practice questions by category. Pause and resume whenever you want.
          </p>
          {/* ✅ THIS IS THE FIX */}
          <button
            className="select-btn"
            onClick={() => navigate("/practice/categories")}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
