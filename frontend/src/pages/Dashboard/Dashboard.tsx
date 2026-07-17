import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReadinessGauge from "../../components/Gauges/ReadinessGauge";
import "../../styles/dashboard.css";

const API_BASE = "http://127.0.0.1:4000";
const TOTAL_QUESTIONS = 1065;
const DEFAULT_EXAM_DATE = "2026-08-16";
const EXAM_DATE_KEY = "studydesk_exam_date";

interface AttemptSummary {
  id: string;
  mode: string;
  score: number | null;
  total: number | null;
  percent: number | null;
  startedAt: string;
  submittedAt: string | null;
}

interface Metrics {
  readyScore: number;
  progressPercent: number;
  accuracy: number;
  dailyTarget: number;
  daysLeft: number;
  totalAttempted: number;
}

function calculateMetrics(attempts: AttemptSummary[], examDate: string): Metrics {
  const now = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(
    Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

  const submitted = attempts.filter((a) => a.submittedAt);
  const totalAttempted = submitted.reduce((sum, a) => sum + (a.total ?? 0), 0);
  const totalCorrect = submitted.reduce((sum, a) => sum + (a.score ?? 0), 0);

  const progressPercent = Math.min(
    Math.round((totalAttempted / TOTAL_QUESTIONS) * 100),
    100
  );
  const accuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const readyScore = Math.min(
    Math.round(accuracy * 0.7 + progressPercent * 0.3),
    100
  );
  const remaining = Math.max(TOTAL_QUESTIONS - totalAttempted, 0);
  const dailyTarget = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  return { readyScore, progressPercent, accuracy, dailyTarget, daysLeft, totalAttempted };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metrics>({
    readyScore: 0, progressPercent: 0, accuracy: 0,
    dailyTarget: 0, daysLeft: 0, totalAttempted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState<string>(
    () => localStorage.getItem(EXAM_DATE_KEY) ?? DEFAULT_EXAM_DATE
  );
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  useEffect(() => {
    fetch(`${API_BASE}/attempts`)
      .then((r) => r.json())
      .then((attempts: AttemptSummary[]) => {
        setMetrics(calculateMetrics(attempts, examDate));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examDate]);

  const saveDate = () => {
    if (!tempDate) return;
    localStorage.setItem(EXAM_DATE_KEY, tempDate);
    setExamDate(tempDate);
    setEditingDate(false);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="study-dashboard-container">
      <header className="dash-top-header">
        <div className="title-area">
          <h1 className="main-title">Study Dashboard</h1>
          <p className="sub-title">Adaptive CISA Preparation Path</p>
        </div>
        <div className="gauge-area">
          <ReadinessGauge score={loading ? 0 : metrics.readyScore} label="ReadySCORE™" />
        </div>
      </header>

      <section className="progression-box">
        <h3 className="group-label">Study Progression</h3>
        <div className="phase-tiles-row">
          <div className="phase-wrap">
            <div className="phase-label">Phase 1: Foundation</div>
            <div className="phase-card completed">
              <span className="phase-icon">✓</span>
              <span className="phase-text">Completed</span>
            </div>
          </div>
          <div className="phase-wrap">
            <div className="phase-label">Domain Deep-Dive</div>
            <div className="phase-card active">
              <span className="phase-icon phase-icon-ring"></span>
              <span className="phase-text">Current</span>
            </div>
          </div>
          <div className="phase-wrap">
            <div className="phase-label">&nbsp;</div>
            <div className="phase-card locked">
              <span className="phase-text">Targeted Review</span>
              <span className="phase-lock">🔒</span>
            </div>
          </div>
        </div>
        <div className="progress-line-container">
          <div className="line-bg"></div>
          <div className="line-fill" style={{ width: `${metrics.progressPercent}%` }}></div>
        </div>
      </section>

      <section className="current-goal-hero">
        <div className="goal-content">
          <span className="goal-tag">CURRENT GOAL</span>
          <h2 className="goal-title">CISA Certification</h2>

          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            {editingDate ? (
              <>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 6,
                    color: "#fff",
                    padding: "4px 8px",
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={saveDate}
                  style={{
                    background: "#7c3aed",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    padding: "4px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => { setTempDate(examDate); setEditingDate(false); }}
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "none",
                    borderRadius: 6,
                    color: "rgba(255,255,255,0.7)",
                    padding: "4px 10px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  Target: {formatDate(examDate)}
                </span>
                <button
                  onClick={() => { setTempDate(examDate); setEditingDate(true); }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 6,
                    color: "rgba(255,255,255,0.65)",
                    padding: "2px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>

          <div className="goal-progress-bar">
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${metrics.progressPercent}%` }}></div>
            </div>
            <span className="bar-label">
              {loading ? "—" : `${metrics.progressPercent}%`} of curriculum complete
            </span>
          </div>
          <button className="resume-btn" onClick={() => navigate("/study")}>
            Resume Study Session
          </button>
        </div>
      </section>

      <footer className="kpi-grid">
        <div className="kpi-tile">
          <label>Daily Target</label>
          <div className="val">
            <strong>{loading ? "—" : metrics.dailyTarget}</strong> Qs / Day
          </div>
        </div>
        <div className="kpi-tile">
          <label>Avg Accuracy</label>
          <div className="val">
            <strong>{loading ? "—" : `${metrics.accuracy}%`}</strong>
          </div>
        </div>
        <div className="kpi-tile">
          <label>Days Left</label>
          <div className="val">
            <strong>{loading ? "—" : metrics.daysLeft}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
