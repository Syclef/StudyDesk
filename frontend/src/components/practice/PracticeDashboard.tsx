import React, { useEffect, useState } from "react";

interface PracticeDashboardDTO {
  percentCorrect: number;        // 0–100
  questionsTaken: number;        // integer
  avgAnswerTime: number | null;  // seconds | null
  avgCorrectTime: number | null; // seconds | null
  avgIncorrectTime: number | null;
  avgSessionDuration: number | null;
}

const formatTime = (seconds: number | null): string => {
  if (seconds === null) return "—";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const PracticeDashboard: React.FC = () => {
  const [data, setData] = useState<PracticeDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/practice/dashboard")
      .then(res => res.json())
      .then((result: PracticeDashboardDTO) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <section className="practice-dashboard">
        <h1>Practice</h1>
        <p>Loading practice metrics…</p>
      </section>
    );
  }

  return (
    <section className="practice-dashboard">
      <h1>Practice</h1>

      {/* Overall Performance */}
      <div className="dashboard-block">
        <h2>Overall Performance</h2>

        <div className="metrics-row">
          <div className="metric">
            <span className="metric-label">% Correct</span>
            <span className="metric-value">
              {data.percentCorrect}%
            </span>
          </div>

          <div className="metric">
            <span className="metric-label">Questions Taken</span>
            <span className="metric-value">
              {data.questionsTaken}
            </span>
          </div>
        </div>
      </div>

      {/* Average Metrics */}
      <div className="dashboard-block">
        <h2>Average Metrics</h2>

        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Avg Answer Time</span>
            <span className="metric-value">
              {formatTime(data.avgAnswerTime)}
            </span>
          </div>

          <div className="metric">
            <span className="metric-label">Avg Correct Time</span>
            <span className="metric-value">
              {formatTime(data.avgCorrectTime)}
            </span>
          </div>

          <div className="metric">
            <span className="metric-label">Avg Incorrect Time</span>
            <span className="metric-value">
              {formatTime(data.avgIncorrectTime)}
            </span>
          </div>

          <div className="metric">
            <span className="metric-label">Avg Session Duration</span>
            <span className="metric-value">
              {formatTime(data.avgSessionDuration)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
