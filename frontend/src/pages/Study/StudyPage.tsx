import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STUDY_TASKS } from "./StudyPlanIndex";
import "../../styles/study-plan.css";

const DOMAINS = [
  {
    name: "Information System Auditing Process",
    tasks: [
      "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
      "Types of Audits, Assessments, and Reviews",
      "Risk-Based Audit Planning",
      "Types of Controls and Considerations",
      "Audit Project Management",
      "Audit Testing and Sampling Methodology",
      "Audit Evidence Collection Techniques",
      "Audit Data Analytics",
      "Reporting and Communication Techniques",
      "Quality Assurance and Improvement of Audit Process",
    ],
  },
  {
    name: "Governance and Management of IT",
    tasks: [
      "Laws, Regulations, and Industry Standards",
      "Organizational Structures and Governance Frameworks",
      "IT Policies, Standards, Procedures, and Guidelines",
      "Enterprise Architecture and Considerations",
      "Enterprise Risk Management",
      "Privacy Program and Principles",
      "Data Governance and Classification",
      "IT Resource Management",
      "IT Vendor Management",
      "IT Performance Monitoring and Reporting",
      "Quality Assurance and Quality Management of IT",
    ],
  },
  {
    name: "Information Systems Operations and Business Resilience",
    tasks: [
      "IT Service Level Management",
      "IT Asset Management",
      "System and Operational Resilience",
      "Database Management",
      "Disaster Recovery Plans",
      "Systems Availability and Capacity Management",
      "Business Impact Analysis",
      "Operational Log Management",
      "Job Scheduling and Production Process Automation",
      "Business Continuity Plan",
      "IT Components",
      "Problem and Incident Management",
      "Shadow IT and End-User Computing",
      "IT Change, Configuration, and Patch Management",
      "Data Backup, Storage, and Restoration",
    ],
  },
  {
    name: "Protection of Information Assets",
    tasks: [
      "Information System Attack Methods and Techniques",
      "Data Loss Prevention",
      "Cloud and Virtualized Environments",
      "Network and End-Point Security",
      "Identity and Access Management",
      "Evidence Collection and Forensics",
      "Data Encryption",
      "Physical and Environmental Controls",
      "Security Awareness Training and Programs",
      "Public Key Infrastructure",
      "Security Testing Tools and Techniques",
      "Security Incident Response Management",
      "Security Monitoring Logs, Tools, and Techniques",
      "Mobile, Wireless, and Internet-of-Things Devices",
      "Information Asset Security Policies, Frameworks, Standards, and Guidelines",
    ],
  },
  {
    name: "Information Systems Acquisition, Development, and Implementation",
    tasks: [
      "System Readiness and Implementation Testing",
      "Project Governance and Management",
      "System Development Methodologies",
      "Implementation Configuration and Release Management",
      "System Migration, Infrastructure Deployment, and Data Conversion",
      "Post-Implementation Review",
      "Business Case and Feasibility Analysis",
      "Control Identification and Design",
    ],
  },
];

export default function StudyPage() {
  const navigate = useNavigate();
  const [openDomain, setOpenDomain] = useState<string | null>(DOMAINS[0].name);

  // Helper function to find question count for a task from your StudyPlanIndex
  const getQuestionCount = (taskName: string) => {
    const taskData = STUDY_TASKS.find((t) => t.category === taskName);
    return taskData ? taskData.total : 0;
  };

  return (
    <div className="dashboard-wrapper">
      <main className="main-content">
        {/* HEADER SECTION: Title + Readiness Gauge */}
        <header className="dashboard-header">
          <div>
            <h1 className="dash-title">Study Dashboard</h1>
            <p className="dash-subtitle">Track your CISA certification progress</p>
          </div>
          <div className="readiness-gauge">
            <div className="gauge-circle" data-score="84">
              <span className="score">84</span>
              <span className="label">ReadySCORE™</span>
            </div>
          </div>
        </header>

        {/* PROGRESSION TILES: Phase Tracking */}
        <section className="progression-section">
          <div className="tile completed">
            <span className="tile-label">PHASE 1</span>
            <span className="tile-name">Foundation</span>
          </div>
          <div className="tile active">
            <span className="tile-label">PHASE 2</span>
            <span className="tile-name">Domain Deep-Dive</span>
          </div>
          <div className="tile locked">
            <span className="tile-label">PHASE 3</span>
            <span className="tile-name">Mock Readiness</span>
          </div>
        </section>

        {/* CURRENT GOAL CARD: Highlighted Domain */}
        <section className="goal-card">
          <div className="goal-content">
            <span className="tag">CURRENT FOCUS</span>
            <h2>Domain 1: Information Systems Auditing Process</h2>
            <div className="progress-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" data-progress="90"></div>
              </div>
              <span className="progress-text">90% of Domain 1 Mastered</span>
            </div>
          </div>
          <button className="resume-btn" onClick={() => setOpenDomain(DOMAINS[0].name)}>
            Resume Session
          </button>
        </section>

        {/* DOMAIN ACCORDION LIST */}
        <section className="domains-container">
          <h3 className="section-title">Knowledge Domains</h3>
          <div className="sp-domains">
            {DOMAINS.map((domain) => {
              const isOpen = openDomain === domain.name;

              return (
                <div key={domain.name} className="sp-domain">
                  <div
                    className="sp-domain-header"
                    onClick={() => setOpenDomain(isOpen ? null : domain.name)}
                  >
                    <span>{domain.name}</span>
                    <span className="chevron">{isOpen ? "▾" : "▸"}</span>
                  </div>

                  {isOpen && (
                    <div className="sp-domain-tasks">
                      {domain.tasks.map((task) => {
                        const qCount = getQuestionCount(task);
                        return (
                          <div key={task} className="sp-task">
                            <div className="task-info">
                              <strong>{task}</strong>
                              <span>{qCount} Questions Available</span>
                            </div>
                            <button
                              disabled={qCount === 0}
                              className={qCount === 0 ? "btn-disabled" : "study-btn"}
                              onClick={() =>
                                navigate(`/study/session/${encodeURIComponent(task)}`)
                              }
                            >
                              {qCount > 0 ? "Study" : "Coming Soon"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM METRICS FOOTER */}
        <footer className="bottom-stats">
          <div className="stat-box">
            <label>Daily Target</label>
            <strong>12 Questions Left</strong>
          </div>
          <div className="stat-box">
            <label>Exam Date</label>
            <strong>Jan 22 (11 Days)</strong>
          </div>
          <div className="stat-box highlight">
            <label>Mastery Streak</label>
            <strong>Top 10% Overall</strong>
          </div>
        </footer>
      </main>
    </div>
  );
}