import { Link, useNavigate } from "react-router-dom";
import "../styles/practice-categories.css";

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
      <div className="pc-tabs" role="tablist" aria-label="Practice Tabs">
        <button
          id="tab-categories"
          className="pc-tab pc-tab--active"
          role="tab"
          aria-selected="true"
          aria-controls="panel-categories"
          tabIndex={0}
          type="button"
        >
          Question Categories
        </button>
        <button
          id="tab-reports"
          className="pc-tab"
          role="tab"
          aria-selected="false"
          aria-controls="panel-reports"
          tabIndex={-1}
          type="button"
        >
          Reports
        </button>
      </div>

      {/* Metrics */}
      <section
        id="panel-categories"
        className="pc-metrics"
        role="tabpanel"
        aria-labelledby="tab-categories"
      >
        <div className="pc-progress-header">
          <span id="pc-progress-label">
            {safeNow.toFixed(1)}% Complete
          </span>
        </div>

        <div
          className={`pc-progress-bar ${safeNow === 0 ? "is-0" : ""}`}
          role="progressbar"
          aria-labelledby="pc-progress-label"
          aria-valuenow={safeNow}
          aria-valuemin={0}
          aria-valuemax={100}
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
            <div className="pc-tile-caption">
              Avg. Correct Answer Time
            </div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgIncorrectTime}</div>
            <div className="pc-tile-caption">
              Avg. Incorrect Answer Time
            </div>
          </div>

          <div className="pc-tile">
            <div className="pc-tile-value">{avgSessionDuration}</div>
            <div className="pc-tile-caption">
              Avg. Session Duration
            </div>
          </div>
        </div>
      </section>

      {/* Categories Table */}
      <div className="pc-card">
        <div className="category-table" role="table" aria-label="Question Categories">
          {/* Header */}
          <div role="rowgroup">
            <div className="table-header" role="row">
              <span className="col-name" role="columnheader">
                Category Name
              </span>
              <span className="col-complete" role="columnheader">
                Complete
              </span>
              <span className="col-correct" role="columnheader">
                % Correct
              </span>
            </div>
          </div>

          {/* Body */}
          <div role="rowgroup">
            {CATEGORIES.map((cat) => (
              <div key={cat.name}>
                {/* Parent row */}
                <div className="table-row parent-row" role="row">
                  <div className="col-name" role="cell">
                    <Link
                    to={`/practice/session/${encodeURIComponent(cat.name)}`}
                    className="category-link parent-link"
                    >
                      {cat.name}
                      </Link>
                      </div>
                      <span className="col-complete" role="cell">0.0%</span>
                      <span className="col-correct" role="cell">0%</span>
                      </div>
                      
                      {/* Child rows */}
                      {cat.children.map((child) => (
                        <div key={child} className="table-row child-row" role="row">
                          <div className="col-name" role="cell">
                            <Link
                            to={`/practice/session/${encodeURIComponent(child)}`}
                            className="category-link child-link"
                            >
                              {child}
                              </Link>
                              </div>
                              <span className="col-complete" role="cell">0.0%</span>
                              <span className="col-correct" role="cell">0%</span>
                              </div>
                            ))}
                            </div>
                          ))}
                          </div>
                          </div>
                          </div>
                          </div>
                          );
                        }
