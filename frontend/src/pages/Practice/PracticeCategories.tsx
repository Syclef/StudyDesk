import { Link, useNavigate } from "react-router-dom";
import "../../styles/practice-categories.css";

const CATEGORIES = [
  {
    name: "Information System Auditing Process",
    children: [
      "Audit Data Analytics",
      "Risk-Based Audit Planning",
      "Types of Controls and Considerations",
      "Quality Assurance and Improvement of Audit Process",
      "IS Audit Standards, Guidelines, Functions, and Codes of Ethics",
      "Audit Testing and Sampling Methodology",
      "Audit Evidence Collection Techniques",
      "Reporting and Communication Techniques",
      "Audit Project Management",
      "Types of Audits, Assessments, and Reviews",
      "Governance and Management of IT",
      "Quality Assurance and Quality Management of IT",
    ],
  },
  {
    name: "Governance and Management of IT",
    children: [
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
    children: [
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
      "Study Interfaces",
      "IT Change, Configuration, and Patch Management",
      "Data Backup, Storage, and Restoration",
    ],
  },
  {
    name: "Protection of Information Assets",
    children: [
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
    children: [
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

export default function PracticeCategories() {
  const navigate = useNavigate();

  const overallCompletePct = 0;
  const correctPct = 0;
  const questionsTaken = 0;
  const avgAnswerTime = "00:00:00";
  const avgCorrectTime = "00:00:00";
  const avgIncorrectTime = "00:00:00";
  const avgSessionDuration = "00:00:00";

  const safeNow = Number.isFinite(overallCompletePct)
    ? Math.min(100, Math.max(0, overallCompletePct))
    : 0;

  return (
    <div className="pc-page">
      {/* Header */}
      <div className="pc-header">
        <div className="pc-header-left">
          <button
            type="button"
            className="pc-back"
            aria-label="Back"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h1 className="pc-title">Dashboard</h1>
        </div>
        <div className="pc-header-right">
          <button className="pc-reset" type="button">
            Reset Questions
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pc-tabs">
        <button className="pc-tab pc-tab--active" type="button">
          Question Categories
        </button>
        <button className="pc-tab" type="button">
          Reports
        </button>
      </div>

      {/* Metrics */}
      <section className="pc-metrics">
        <div className="pc-progress-header">
          <span>{safeNow.toFixed(1)}% Complete</span>
        </div>

        {/* Progress bar (visual only — ARIA removed to fix axe error) */}
        <div
          className={`pc-progress-bar ${safeNow === 0 ? "is-0" : ""}`}
          data-pct={safeNow}
        >
          <div className="pc-progress-fill" />
        </div>

        <div className="pc-tiles">
          <div className="pc-tile pc-tile--primary">
            <div className="pc-tile-value">{correctPct}%</div>
            <div className="pc-tile-caption">Correct</div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">
              {questionsTaken.toLocaleString()}
            </div>
            <div className="pc-tile-caption">Questions Taken</div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgAnswerTime}</div>
            <div className="pc-tile-caption">Avg. Answer Time</div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgCorrectTime}</div>
            <div className="pc-tile-caption">Avg. Correct Answer Time</div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgIncorrectTime}</div>
            <div className="pc-tile-caption">Avg. Incorrect Answer Time</div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgSessionDuration}</div>
            <div className="pc-tile-caption">Avg. Session Duration</div>
          </div>
        </div>
      </section>

      {/* Categories Table */}
      <div className="pc-card">
        <div className="category-table">
          <div className="table-header">
            <span className="col-name">Category Name</span>
            <span className="col-complete">Complete</span>
            <span className="col-correct">% Correct</span>
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <div className="table-row parent-row">
                <div className="col-name">
                  <Link
                    to={`/practice/session/${encodeURIComponent(cat.name)}`}
                    className="category-link parent-link"
                  >
                    {cat.name}
                  </Link>
                </div>
                <span className="col-complete">0.0%</span>
                <span className="col-correct">0%</span>
              </div>

              {cat.children.map((child) => (
                <div key={child} className="table-row child-row">
                  <div className="col-name">
                    <Link
                      to={`/practice/session/${encodeURIComponent(child)}`}
                      className="category-link child-link"
                    >
                      {child}
                    </Link>
                  </div>
                  <span className="col-complete">0.0%</span>
                  <span className="col-correct">0%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
