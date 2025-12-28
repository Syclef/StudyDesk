import React, { useState } from "react";
import "../styles/study-plan.css";

interface Task {
  id: string;
  title: string;
  points: number;
  duration: string;
}

interface Domain {
  id: string;
  name: string;
  tasks: Task[];
}

interface PracticeExam {
  id: string;
  title: string;
  points: number;
  duration: string;
}

export default function StudyPlan() {
  /* ===============================
     ZERO-STATE METRICS
     =============================== */

  const daysUntilExam = 11; // placeholder only
  const progressPercent = 0;
  const completedGroups = 0;

  /* ===============================
     DOMAIN DATA (STATIC / ZERO STATE)
     =============================== */

  const domains: Domain[] = [
    { id: "d1", name: "Information Systems Auditing Process", tasks: [] },
    { id: "d2", name: "Governance and Management of IT", tasks: [] },
    {
      id: "d3",
      name:
        "Information Systems Acquisition, Development and Implementation",
      tasks: [],
    },
    {
      id: "d4",
      name:
        "Information Systems Operations and Business Resilience",
      tasks: [],
    },
    { id: "d5", name: "Protection of Information Assets", tasks: [] },
  ];

  const practiceExams: PracticeExam[] = [
    {
      id: "pe1",
      title: "Practice Exam 1",
      points: 300,
      duration: "60+ Minutes",
    },
    {
      id: "pe2",
      title: "Practice Exam 2",
      points: 300,
      duration: "60+ Minutes",
    },
    {
      id: "pe3",
      title: "Practice Exam 3",
      points: 300,
      duration: "60+ Minutes",
    },
  ];

  /* ===============================
     UI STATE
     =============================== */

  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  return (
    <section className="study-plan-dashboard">
      <h1>Study Plan</h1>

      {/* ===============================
         SUMMARY ROW
         =============================== */}
      <div className="study-summary">
        <div className="summary-box">
          <strong>{daysUntilExam}</strong>
          <span>Days Until Exam</span>
        </div>

        <div className="summary-progress">
          <div className="summary-progress-header">
            <span>Study Plan Progress</span>
            <span className="summary-muted">{progressPercent}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              data-progress={progressPercent}
            />
          </div>

          <div className="summary-progress-footer">
            <button type="button" className="completed-groups-btn">
              {completedGroups} Completed Groups
            </button>
            <span>of 5 Domains</span>
          </div>
        </div>
      </div>

      {/* ===============================
         ZERO-STATE BANNER
         =============================== */}
      <div className="study-banner">
        <strong>No study activity yet</strong>
        <p>
          Begin practicing questions to unlock progress across
          the CISA domains.
        </p>
      </div>

      {/* ===============================
         DOMAIN ACCORDIONS
         =============================== */}
      <div className="study-domains">
        {domains.map(domain => (
          <div key={domain.id} className="domain-group">
            <div
              className="domain-header clickable"
              onClick={() => toggleSection(domain.id)}
            >
              <span>{domain.name}</span>
              <span>
                {openSection === domain.id ? "▾" : "▸"}
              </span>
            </div>

            {openSection === domain.id && (
              <div className="domain-tasks empty">
                <p className="task-empty">
                  No tasks started for this domain yet.
                </p>
              </div>
            )}
          </div>
        ))}

        {/* ===============================
           PRACTICE EXAMS (MATCHES PERFORM)
           =============================== */}
        <div className="domain-group">
          <div
            className="domain-header clickable"
            onClick={() => toggleSection("practice-exams")}
          >
            <span>
              Practice Exams | {practiceExams.length} Tasks |{" "}
              {practiceExams.reduce((s, e) => s + e.points, 0)} Knowledge Points
            </span>
            <span>
              {openSection === "practice-exams" ? "▾" : "▸"}
            </span>
          </div>

          {openSection === "practice-exams" && (
            <div className="domain-tasks">
              {practiceExams.map(exam => (
                <div key={exam.id} className="task-row">
                  <div className="task-left">
                    <span className="task-icon">📝</span>
                    <span className="task-title">{exam.title}</span>
                  </div>
                  <div className="task-meta">
                    {exam.points} Knowledge Points | {exam.duration}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
