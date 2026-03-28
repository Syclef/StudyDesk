import { useNavigate } from "react-router-dom";
import "../styles/practice-dashboard.css";

export default function Practice() {
  const navigate = useNavigate();

  return (
    <div className="practice-dashboard-page">
      {/* Top Tabs */}
      <div className="practice-tabs">
        <span className="tab active">Practice</span>
        <span className="tab">Dashboard</span>
        <span className="tab">Notes</span>
        <span className="tab">Bookmarks</span>
        <span className="tab">Highlights</span>
      </div>

      {/* Header */}
      <div className="practice-header">
        <h2>Dashboard</h2>
        <button className="reset-btn">Reset all Questions</button>
      </div>

      {/* Progress */}
      <div className="practice-progress">
        <div className="progress-label">0.0% Complete</div>
        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
      </div>

      {/* Metrics */}
      <div className="practice-metrics">
        <div className="metric-main">
          <div className="metric-main-value">0%</div>
          <div className="metric-main-label">Correct</div>
        </div>

        <div className="metric">
          <div className="metric-value">0 of 0</div>
          <div className="metric-label">Questions Taken</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:00</div>
          <div className="metric-label">Avg. Answer Time</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:00</div>
          <div className="metric-label">Avg. Correct Answer Time</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:00</div>
          <div className="metric-label">Avg. Incorrect Answer Time</div>
        </div>

        <div className="metric">
          <div className="metric-value">00:00:00</div>
          <div className="metric-label">Avg. Session Duration</div>
        </div>
      </div>

      {/* Practice Options */}
      <div className="practice-cards">
        <div className="practice-card">
          <h3>Custom Practice</h3>
          <p>Configure a set of questions as you like.</p>
          <button className="select-btn">Select</button>
        </div>

        <div className="practice-card">
          <h3>Category Practice</h3>
          <p>
            Practice questions by category. Pause and resume whenever you want.
          </p>
          <button
            className="select-btn"
            onClick={() =>
              navigate(
                "/practice/category/Information%20Systems%20Auditing%20Process"
              )
            }
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
