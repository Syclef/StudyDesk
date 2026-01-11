import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadinessGauge from "../../components/gauges/ReadinessGauge";
import { STUDY_TASKS } from "../../data/studyTasks";
import { getAllSessions } from "../../data/studySessions";
import { calculateStudyMetrics } from "../../utils/studyLogic";
import "../../styles/dashboard.css"; 

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const sessions = getAllSessions();
    return calculateStudyMetrics(sessions, "2026-01-22");
  }, []);

  const nextTask = useMemo(() => {
    const sessions = getAllSessions();
    const completedTaskIds = new Set(sessions.map(s => s.taskId));
    return STUDY_TASKS.find(task => !completedTaskIds.has(task.id)) || STUDY_TASKS[0];
  }, []);

  return (
    <div className="study-dashboard-container">
      {/* TOP SECTION: TITLE & GAUGE */}
      <header className="dash-top-header">
        <div className="title-area">
          <h1 className="main-title">Study Dashboard</h1>
          <p className="sub-title">Adaptive CISA Preparation Path</p>
        </div>
        <div className="gauge-area">
           <ReadinessGauge score={metrics.readyScore} label="ReadySCORE™" />
        </div>
      </header>

      {/* PHASE PROGRESSION AREA */}
<section className="progression-box">
  <h3 className="group-label">Study Progression</h3>

  <div className="phase-tiles-row">
    {/* Completed */}
    <div className="phase-wrap">
      <div className="phase-label">Phase 2: Foundation</div>

      <div className="phase-card completed">
        <span className="phase-icon">✓</span>
        <span className="phase-text">Completed</span>
      </div>
    </div>

    {/* Current */}
    <div className="phase-wrap">
      <div className="phase-label">Domain Deep-Dive</div>

      <div className="phase-card active">
        <span className="phase-icon phase-icon-ring"></span>
        <span className="phase-text">Current</span>
        <span className="phase-lock">🔒</span>
      </div>
    </div>

    {/* Locked */}
    <div className="phase-wrap">
      <div className="phase-label">&nbsp;</div>

      <div className="phase-card locked">
        <span className="phase-text">Targeted Review</span>
        <span className="phase-lock">🔒</span>
      </div>
    </div>
  </div>

  {/* Progress Line */}
  <div className="progress-line-container">
    <div className="line-bg"></div>
    <div className="line-fill" data-progress="45"></div>
  </div>
</section>

      {/* CURRENT GOAL PURPLE CARD */}
      <section className="current-goal-hero">
        <div className="goal-content">
          <span className="goal-tag">CURRENT GOAL</span>
          <h2 className="goal-title">{nextTask.title}</h2>
          <div className="goal-progress-bar">
             <div className="bar-bg">
               {/* FIXED: Removed inline style, passing value to data-attribute */}
               <div className="bar-fill" data-progress={metrics.progressPercent}></div>
             </div>
             <span className="bar-label">{metrics.progressPercent}% of curriculum complete</span>
          </div>
          <button className="resume-btn" onClick={() => navigate(`/study-session/${nextTask.id}`)}>
            Resume Study Session
          </button>
        </div>
      </section>

      {/* BOTTOM KPI GRID */}
      <footer className="kpi-grid">
        <div className="kpi-tile">
          <label>Daily Target</label>
          <div className="val"><strong>12</strong> Qs / Day</div>
        </div>
        <div className="kpi-tile">
          <label>Avg Accuracy</label>
          <div className="val"><strong>120</strong> Mastered</div>
        </div>
        <div className="kpi-tile">
          <label>Current Rank</label>
          <div className="val"><strong>Top 10%</strong></div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;